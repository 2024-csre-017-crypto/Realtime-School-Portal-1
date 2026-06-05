import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { syllabusTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/session";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fileStorage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `syllabus_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only image or PDF files allowed"));
  },
});

const router = Router();

router.get("/:studentId", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const { studentId } = req.params;
  const entries = await db.select().from(syllabusTable).where(eq(syllabusTable.studentId, studentId));
  res.json(entries);
});

router.post("/:studentId", upload.fields([{ name: "image", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "teacher") {
    res.status(403).json({ message: "Teachers only" });
    return;
  }

  const { studentId } = req.params;
  const { subject, totalChapters, doneChapters, lastTopic } = req.body;

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const imageUrl = files?.image?.[0] ? `/uploads/${files.image[0].filename}` : undefined;
  const pdfUrl = files?.pdf?.[0] ? `/uploads/${files.pdf[0].filename}` : undefined;

  const existing = await db.select().from(syllabusTable)
    .where(and(eq(syllabusTable.studentId, studentId), eq(syllabusTable.subject, subject)));

  if (existing.length > 0) {
    const updateData: Record<string, unknown> = {
      totalChapters: Number(totalChapters),
      doneChapters: Number(doneChapters),
      lastTopic,
      teacherId: user.id,
    };
    if (imageUrl) updateData.bookImage = imageUrl;
    if (pdfUrl) updateData.pdfUrl = pdfUrl;

    const [updated] = await db.update(syllabusTable)
      .set(updateData)
      .where(and(eq(syllabusTable.studentId, studentId), eq(syllabusTable.subject, subject)))
      .returning();
    res.status(201).json(updated);
    return;
  }

  const [entry] = await db.insert(syllabusTable).values({
    studentId,
    subject,
    totalChapters: Number(totalChapters),
    doneChapters: Number(doneChapters),
    lastTopic,
    teacherId: user.id,
    bookImage: imageUrl ?? null,
    pdfUrl: pdfUrl ?? null,
  }).returning();

  res.status(201).json(entry);
});

export default router;
