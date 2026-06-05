import { Router } from "express";
import { db } from "@workspace/db";
import { testResultsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/session";
import { recalcProgress } from "./progress";

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const results = await db
    .select()
    .from(testResultsTable)
    .where(eq(testResultsTable.studentId, req.params.studentId))
    .orderBy(desc(testResultsTable.date));
  res.json(results);
});

router.post("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" }); return;
  }
  const { studentId, subject, title, date, totalMarks, obtainedMarks, imageUrl } = req.body;

  const [result] = await db.insert(testResultsTable).values({
    studentId,
    teacherId: user.id,
    subject,
    title,
    date,
    totalMarks: Number(totalMarks),
    obtainedMarks: Number(obtainedMarks),
    image: imageUrl ?? null,
  }).returning();

  await recalcProgress(studentId).catch(() => {});

  res.status(201).json(result);
});

router.delete("/:id", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" }); return;
  }
  const [deleted] = await db.select().from(testResultsTable).where(eq(testResultsTable.id, Number(req.params.id)));
  await db.delete(testResultsTable).where(eq(testResultsTable.id, Number(req.params.id)));
  if (deleted) await recalcProgress(deleted.studentId).catch(() => {});
  res.json({ ok: true });
});

export default router;
