import { Router } from "express";
import { db } from "@workspace/db";
import { studentsTable, teachersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getSession, setSession, clearSession, requireAuth } from "../lib/session";

const router = Router();

router.post("/login", async (req, res) => {
  const { role, id, password } = req.body;

  if (!role || !id || !password) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  if (role === "admin") {
    if (id === "admin" && password === "admin123") {
      setSession(res, { role: "admin", id: "admin", name: "Administrator" });
      res.json({ role: "admin", id: "admin", name: "Administrator" });
    } else {
      res.status(401).json({ message: "Admin credentials galat hain" });
    }
    return;
  }

  if (role === "teacher") {
    const [teacher] = await db.select().from(teachersTable).where(eq(teachersTable.id, id));
    if (!teacher || teacher.password !== password) {
      res.status(401).json({ message: "Teacher ID ya password galat hai" });
      return;
    }
    setSession(res, { role: "teacher", id: teacher.id, name: teacher.name });
    res.json({ role: "teacher", id: teacher.id, name: teacher.name });
    return;
  }

  if (role === "student") {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
    if (!student || student.password !== password) {
      res.status(401).json({ message: "Student ID ya password galat hai" });
      return;
    }
    setSession(res, { role: "student", id: student.id, name: student.name });
    res.json({ role: "student", id: student.id, name: student.name });
    return;
  }

  res.status(400).json({ message: "Invalid role" });
});

router.get("/me", (req, res) => {
  const user = getSession(req);
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  res.json(user);
});

router.post("/logout", (_req, res) => {
  clearSession(res);
  res.json({ message: "Logged out" });
});

export default router;
