import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { testResultsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/session";
import { recalcProgress } from "./progress";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imgStorage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `result_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage: imgStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

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

router.get("/", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" }); return;
  }
  const results = await db
    .select()
    .from(testResultsTable)
    .where(eq(testResultsTable.teacherId, user.id))
    .orderBy(desc(testResultsTable.date));
  res.json(results);
});

router.post("/", upload.single("image"), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" }); return;
  }
  const { studentId, subject, title, date, totalMarks, obtainedMarks } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const [result] = await db.insert(testResultsTable).values({
    studentId,
    teacherId: user.id,
    subject,
    title,
    date,
    totalMarks: Number(totalMarks),
    obtainedMarks: Number(obtainedMarks),
    image: imageUrl,
  }).returning();

  await recalcProgress(studentId).catch(() => {});

  res.status(201).json(result);
});

router.post("/:id/image", upload.single("image"), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" }); return;
  }
  if (!req.file) { res.status(400).json({ message: "No image provided" }); return; }
  const imageUrl = `/uploads/${req.file.filename}`;
  const [updated] = await db
    .update(testResultsTable)
    .set({ image: imageUrl })
    .where(eq(testResultsTable.id, Number(req.params.id)))
    .returning();
  res.json(updated);
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
