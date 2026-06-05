import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { diaryTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imgStorage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `diary_${Date.now()}${ext}`);
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

  const { studentId } = req.params;
  const entries = await db.select().from(diaryTable).where(eq(diaryTable.studentId, studentId))
    .orderBy(diaryTable.date);
  res.json(entries);
});

router.post("/:studentId", upload.single("image"), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" });
    return;
  }

  const { studentId } = req.params;
  const { date, subject, note } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const [entry] = await db.insert(diaryTable).values({
    studentId,
    date,
    subject,
    note,
    teacherId: user.id,
    image: imageUrl,
  }).returning();

  res.status(201).json(entry);
});

export default router;
