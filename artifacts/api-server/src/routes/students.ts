import { Router } from "express";
import { db } from "@workspace/db";
import { studentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const router = Router();

router.get("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const students = await db.select({
    id: studentsTable.id,
    name: studentsTable.name,
    class: studentsTable.class,
    father: studentsTable.father,
    phone: studentsTable.phone,
    dob: studentsTable.dob,
    address: studentsTable.address,
    rollNo: studentsTable.rollNo,
  }).from(studentsTable);

  res.json(students);
});

router.post("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { name, password, class: cls, father, phone, dob, address, rollNo } = req.body;

  const allStudents = await db.select({ id: studentsTable.id }).from(studentsTable);
  const nextNum = allStudents.length + 1;
  const id = `STU${String(nextNum).padStart(3, "0")}`;

  const [student] = await db.insert(studentsTable).values({
    id,
    name,
    password,
    class: cls,
    father,
    phone,
    dob,
    address,
    rollNo,
  }).returning();

  res.status(201).json({
    id: student.id,
    name: student.name,
    class: student.class,
    father: student.father,
    phone: student.phone,
    dob: student.dob,
    address: student.address,
    rollNo: student.rollNo,
  });
});

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  res.json({
    id: student.id,
    name: student.name,
    class: student.class,
    father: student.father,
    phone: student.phone,
    dob: student.dob,
    address: student.address,
    rollNo: student.rollNo,
  });
});

router.put("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { studentId } = req.params;
  const { name, password, class: cls, father, phone, dob, address, rollNo } = req.body;

  const updateData: Record<string, unknown> = { name, class: cls, father, phone, dob, address, rollNo };
  if (password) updateData.password = password;

  const [student] = await db.update(studentsTable)
    .set(updateData)
    .where(eq(studentsTable.id, studentId))
    .returning();

  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  res.json({
    id: student.id,
    name: student.name,
    class: student.class,
    father: student.father,
    phone: student.phone,
    dob: student.dob,
    address: student.address,
    rollNo: student.rollNo,
  });
});

router.delete("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const { studentId } = req.params;
  await db.delete(studentsTable).where(eq(studentsTable.id, studentId));
  res.json({ message: "Deleted" });
});

export default router;
