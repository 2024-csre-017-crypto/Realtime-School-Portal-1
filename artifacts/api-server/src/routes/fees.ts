import { Router } from "express";
import { db } from "@workspace/db";
import { feesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;
  const fees = await db.select().from(feesTable).where(eq(feesTable.studentId, studentId));
  res.json(fees);
});

router.post("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { studentId } = req.params;
  const { month, amount, paid, paidDate } = req.body;

  const [fee] = await db.insert(feesTable).values({
    studentId,
    month,
    amount: Number(amount),
    paid: Boolean(paid),
    paidDate: paidDate || null,
  }).returning();

  res.status(201).json(fee);
});

router.put("/:studentId/:feeId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { studentId, feeId } = req.params;
  const { paid, paidDate } = req.body;

  const [fee] = await db.update(feesTable)
    .set({ paid: Boolean(paid), paidDate: paidDate || null })
    .where(and(eq(feesTable.id, Number(feeId)), eq(feesTable.studentId, studentId)))
    .returning();

  if (!fee) {
    res.status(404).json({ message: "Fee record not found" });
    return;
  }

  res.json(fee);
});

export default router;
