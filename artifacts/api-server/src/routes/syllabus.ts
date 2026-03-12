import { Router } from "express";
import { db } from "@workspace/db";
import { syllabusTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;
  const entries = await db.select().from(syllabusTable).where(eq(syllabusTable.studentId, studentId));
  res.json(entries);
});

router.post("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" });
    return;
  }

  const { studentId } = req.params;
  const { subject, totalChapters, doneChapters, lastTopic } = req.body;

  const existing = await db.select().from(syllabusTable)
    .where(and(eq(syllabusTable.studentId, studentId), eq(syllabusTable.subject, subject)));

  if (existing.length > 0) {
    const [updated] = await db.update(syllabusTable)
      .set({ totalChapters: Number(totalChapters), doneChapters: Number(doneChapters), lastTopic, teacherId: user.id })
      .where(and(eq(syllabusTable.studentId, studentId), eq(syllabusTable.subject, subject)))
      .returning();
    res.status(201).json(updated);
    return;
  }

  const [entry] = await db.insert(syllabusTable).values({
    studentId,
    subject,
    totalChapters: Number(totalChapters),
    doneChapters: Number(doneChapters),
    lastTopic,
    teacherId: user.id,
  }).returning();

  res.status(201).json(entry);
});

export default router;
