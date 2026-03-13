import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable, studentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

// Normalize Pakistani phone number to international format
function normalizePhone(to: string): string {
  let n = to.replace(/\s+/g, "").replace(/-/g, "");
  if (n.startsWith("0")) n = "92" + n.slice(1);
  else if (n.startsWith("+")) n = n.slice(1);
  else if (!n.startsWith("92")) n = "92" + n;
  return n;
}

// Send WhatsApp message via Fonnte API
async function sendWhatsApp(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) return { ok: false, error: "Fonnte not configured" };

  const number = normalizePhone(to);
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target: number, message: body, countryCode: "92" }),
    });
    const data = await res.json() as any;
    if (!res.ok || data?.status === false) {
      return { ok: false, error: data?.reason || data?.message || "WhatsApp send failed" };
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


  const isWhatsAppConfigured = !!process.env.FONNTE_TOKEN;
  let smsStatus = "no_sms";
  let smsError: string | null = null;
  let sentCount = 0;
  let failedCount = 0;

  if (isWhatsAppConfigured) {
    const waBody = `*The Excel School*\n*${title}*\n\n${message}\n\n_Principal: Sir Ahmad Raza_\n_+92 306 2549080_`;
    const results = await Promise.allSettled(
      students.map(s => sendWhatsApp(s.phone, waBody))
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
    smsEnabled: isWhatsAppConfigured,
    sentCount,
    failedCount,
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
