import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable, studentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

// Send SMS via Twilio REST API (no SDK needed)
async function sendTwilioSMS(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { ok: false, error: "Twilio not configured" };
  }

  // Normalize Pakistani number: 03xx → +923xx
  let normalized = to.replace(/\s+/g, "").replace(/-/g, "");
  if (normalized.startsWith("0")) normalized = "+92" + normalized.slice(1);
  else if (!normalized.startsWith("+")) normalized = "+92" + normalized;

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: normalized, From: fromNumber, Body: body }).toString(),
      }
    );
    const data = await res.json() as any;
    if (!res.ok) {
      if (data?.code === 21608) {
        return { ok: false, error: `Trial: number ${normalized} not verified in Twilio console` };
      }
      return { ok: false, error: data?.message || "SMS failed" };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// GET /api/admin/notifications
router.get("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") { res.status(403).json({ message: "Admin only" }); return; }

  const notifications = await db
    .select()
    .from(notificationsTable)
    .orderBy(desc(notificationsTable.sentAt));
  res.json(notifications);
});

// GET /api/admin/notifications/preview?targetType=all|class&targetClass=10A
router.get("/preview", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") { res.status(403).json({ message: "Admin only" }); return; }

  const { targetType, targetClass } = req.query as Record<string, string>;
  let students;
  if (targetType === "class" && targetClass) {
    students = await db.select({ id: studentsTable.id, name: studentsTable.name, phone: studentsTable.phone, class: studentsTable.class, father: studentsTable.father })
      .from(studentsTable).where(eq(studentsTable.class, targetClass));
  } else {
    students = await db.select({ id: studentsTable.id, name: studentsTable.name, phone: studentsTable.phone, class: studentsTable.class, father: studentsTable.father })
      .from(studentsTable);
  }

  // Get unique classes for dropdown
  const allClasses = await db.select({ class: studentsTable.class }).from(studentsTable);
  const classes = [...new Set(allClasses.map(s => s.class))].sort();

  res.json({ students, classes, count: students.length });
});

// POST /api/admin/notifications/send
router.post("/send", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") { res.status(403).json({ message: "Admin only" }); return; }

  const { title, message, targetType, targetClass } = req.body;
  if (!title || !message || !targetType) {
    res.status(400).json({ message: "title, message, and targetType are required" });
    return;
  }

  // Get target students
  let students;
  if (targetType === "class" && targetClass) {
    students = await db.select({ id: studentsTable.id, name: studentsTable.name, phone: studentsTable.phone, father: studentsTable.father })
      .from(studentsTable).where(eq(studentsTable.class, targetClass));
  } else {
    students = await db.select({ id: studentsTable.id, name: studentsTable.name, phone: studentsTable.phone, father: studentsTable.father })
      .from(studentsTable);
  }

  const isTwilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
  let smsStatus = "no_sms";
  let smsError: string | null = null;
  let sentCount = 0;
  let failedCount = 0;

  if (isTwilioConfigured) {
    const smsBody = `The Excel School\n${title}\n\n${message}`;
    const results = await Promise.allSettled(
      students.map(s => sendTwilioSMS(s.phone, smsBody))
    );
    results.forEach(r => {
      if (r.status === "fulfilled" && r.value.ok) sentCount++;
      else failedCount++;
    });
    smsStatus = failedCount === 0 ? "sent" : sentCount > 0 ? "partial" : "failed";
    if (failedCount > 0) smsError = `${sentCount} sent, ${failedCount} failed`;
  }

  const [notification] = await db.insert(notificationsTable).values({
    title,
    message,
    targetType,
    targetClass: targetClass || null,
    recipientCount: students.length,
    sentAt: new Date().toISOString(),
    smsStatus,
    smsError,
  }).returning();

  res.json({
    notification,
    recipients: students.length,
    smsEnabled: isTwilioConfigured,
    sentCount: isTwilioConfigured ? sentCount : 0,
    failedCount: isTwilioConfigured ? failedCount : 0,
  });
});

// DELETE /api/admin/notifications/:id
router.delete("/:id", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") { res.status(403).json({ message: "Admin only" }); return; }
  await db.delete(notificationsTable).where(eq(notificationsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
