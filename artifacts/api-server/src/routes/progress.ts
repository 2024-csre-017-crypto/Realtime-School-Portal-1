import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable, testResultsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

function calcGrade(avg: number): string {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

async function recalcProgress(studentId: string) {
  const results = await db.select().from(testResultsTable).where(eq(testResultsTable.studentId, studentId));
  if (results.length === 0) return null;

  const totalPct = results.reduce((sum, r) => sum + (r.obtainedMarks / r.totalMarks) * 100, 0);
  const testAvg = Math.round((totalPct / results.length) * 10) / 10;
  const grade = calcGrade(testAvg);

  const existing = await db.select().from(progressTable).where(eq(progressTable.studentId, studentId));
  if (existing.length > 0) {
    const [row] = await db.update(progressTable)
      .set({ testAvg, grade })
      .where(eq(progressTable.studentId, studentId))
      .returning();
    return row;
  } else {
    const [row] = await db.insert(progressTable)
      .values({ studentId, attendance: 0, testAvg, rank: 1, remarks: "", grade })
      .returning();
    return row;
  }
}

export { recalcProgress };

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;

  await recalcProgress(studentId).catch(() => {});

  const [row] = await db.select().from(progressTable).where(eq(progressTable.studentId, studentId));

  if (!row) {
    res.json({ studentId, attendance: 0, testAvg: 0, rank: 1, remarks: "", grade: "" });
    return;
  }

  res.json(row);
});

router.put("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    res.status(403).json({ message: "Admin or teacher only" });
    return;
  }

  const { studentId } = req.params;
  const { attendance, testAvg, rank, remarks, grade } = req.body;

  const existing = await db.select().from(progressTable).where(eq(progressTable.studentId, studentId));

  if (existing.length > 0) {
    const [row] = await db.update(progressTable)
      .set({ attendance: Number(attendance), testAvg: Number(testAvg), rank: Number(rank), remarks, grade })
      .where(eq(progressTable.studentId, studentId))
      .returning();
    res.json(row);
  } else {
    const [row] = await db.insert(progressTable)
      .values({ studentId, attendance: Number(attendance), testAvg: Number(testAvg), rank: Number(rank), remarks, grade })
      .returning();
    res.json(row);
  }
});

export default router;
