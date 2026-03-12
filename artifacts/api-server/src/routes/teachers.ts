import { Router } from "express";
import { db } from "@workspace/db";
import { teachersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const teachers = await db.select({
    id: teachersTable.id,
    name: teachersTable.name,
    subject: teachersTable.subject,
    joining: teachersTable.joining,
    salary: teachersTable.salary,
    phone: teachersTable.phone,
    address: teachersTable.address,
    classes: teachersTable.classes,
  }).from(teachersTable);

  res.json(teachers);
});

router.post("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { name, password, subject, joining, salary, phone, address, classes } = req.body;

  const allTeachers = await db.select({ id: teachersTable.id }).from(teachersTable);
  const nextNum = allTeachers.length + 1;
  const id = `T${String(nextNum).padStart(3, "0")}`;

  const [teacher] = await db.insert(teachersTable).values({
    id,
    name,
    password,
    subject,
    joining,
    salary: Number(salary),
    phone,
    address,
    classes: classes || [],
  }).returning();

  res.status(201).json({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    joining: teacher.joining,
    salary: teacher.salary,
    phone: teacher.phone,
    address: teacher.address,
    classes: teacher.classes,
  });
});

router.put("/:teacherId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { teacherId } = req.params;
  const { name, password, subject, joining, salary, phone, address, classes } = req.body;

  const updateData: Record<string, unknown> = { name, subject, joining, salary: Number(salary), phone, address, classes: classes || [] };
  if (password) updateData.password = password;

  const [teacher] = await db.update(teachersTable)
    .set(updateData)
    .where(eq(teachersTable.id, teacherId))
    .returning();

  if (!teacher) {
    res.status(404).json({ message: "Teacher not found" });
    return;
  }

  res.json({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    joining: teacher.joining,
    salary: teacher.salary,
    phone: teacher.phone,
    address: teacher.address,
    classes: teacher.classes,
  });
});

router.delete("/:teacherId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { teacherId } = req.params;
  await db.delete(teachersTable).where(eq(teachersTable.id, teacherId));
  res.json({ message: "Deleted" });
});

export default router;
