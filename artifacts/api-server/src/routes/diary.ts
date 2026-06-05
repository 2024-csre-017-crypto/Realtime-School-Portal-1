import { Router } from "express";
import { db } from "@workspace/db";
import { diaryTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;
  const entries = await db.select().from(diaryTable).where(eq(diaryTable.studentId, studentId))
    .orderBy(diaryTable.date);
  res.json(entries);
});

router.post("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" });
    return;
  }

  const { studentId } = req.params;
  const { date, subject, note, imageUrl } = req.body;

  const [entry] = await db.insert(diaryTable).values({
    studentId,
    date,
    subject,
    note,
    teacherId: user.id,
    image: imageUrl ?? null,
  }).returning();

  res.status(201).json(entry);
});

export default router;
