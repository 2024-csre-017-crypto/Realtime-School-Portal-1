import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { studentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const photoStorage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

const router = Router();

const selectStudent = (s: typeof studentsTable.$inferSelect) => ({
  id: s.id,
  name: s.name,
  class: s.class,
  father: s.father,
  phone: s.phone,
  dob: s.dob,
  address: s.address,
  rollNo: s.rollNo,
  photo: s.photo ?? null,
});

router.get("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const students = await db.select().from(studentsTable);
  res.json(students.map(selectStudent));
});

router.post("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }
  const { name, password, class: cls, father, phone, dob, address, rollNo } = req.body;
  const allStudents = await db.select({ id: studentsTable.id }).from(studentsTable);
  const id = `STU${String(allStudents.length + 1).padStart(3, "0")}`;
  const [student] = await db.insert(studentsTable).values({
    id, name, password, class: cls, father, phone, dob, address, rollNo,
  }).returning();
  res.status(201).json(selectStudent(student));
});

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { studentId } = req.params;
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) { res.status(404).json({ message: "Student not found" }); return; }
  res.json(selectStudent(student));
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
  const [student] = await db.update(studentsTable).set(updateData)
    .where(eq(studentsTable.id, studentId)).returning();
  if (!student) { res.status(404).json({ message: "Student not found" }); return; }
  res.json(selectStudent(student));
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

// ── Photo Upload ─────────────────────────────────────────────────
router.post("/:studentId/photo", uploadPhoto.single("photo"), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;

  // Student can only upload their own photo; admin can upload for anyone
  if (user.role === "student" && user.id !== studentId) {
    res.status(403).json({ message: "Only your own photo upload kar sakte ho" });
    return;
  }
  if (user.role === "teacher") {
    res.status(403).json({ message: "Teachers cannot upload student photos" });
    return;
  }

  if (!req.file) { res.status(400).json({ message: "No file uploaded" }); return; }

  const photoUrl = `/uploads/${req.file.filename}`;
  const [student] = await db.update(studentsTable)
    .set({ photo: photoUrl })
    .where(eq(studentsTable.id, studentId))
    .returning();

  if (!student) { res.status(404).json({ message: "Student not found" }); return; }
  res.json({ photo: photoUrl });
});

export default router;
