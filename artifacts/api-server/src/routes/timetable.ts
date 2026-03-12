import { Router } from "express";
import { db } from "@workspace/db";
import { timetableTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/:classId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { classId } = req.params;
  const [row] = await db.select().from(timetableTable).where(eq(timetableTable.classId, classId));

  if (!row) {
    res.json({ classId, schedule: {} });
    return;
  }

  res.json({ classId: row.classId, schedule: row.schedule });
});

router.put("/:classId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { classId } = req.params;
  const { schedule } = req.body;

  const existing = await db.select().from(timetableTable).where(eq(timetableTable.classId, classId));

  if (existing.length > 0) {
    const [row] = await db.update(timetableTable)
      .set({ schedule })
      .where(eq(timetableTable.classId, classId))
      .returning();
    res.json({ classId: row.classId, schedule: row.schedule });
  } else {
    const [row] = await db.insert(timetableTable)
      .values({ classId, schedule })
      .returning();
    res.json({ classId: row.classId, schedule: row.schedule });
  }
});

export default router;
