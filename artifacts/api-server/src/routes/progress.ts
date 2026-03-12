import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;
  const [row] = await db.select().from(progressTable).where(eq(progressTable.studentId, studentId));

  if (!row) {
    res.json({ studentId, attendance: 0, testAvg: 0, rank: 1, remarks: "", grade: "" });
    return;
  }

  res.json(row);
});

router.put("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
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
