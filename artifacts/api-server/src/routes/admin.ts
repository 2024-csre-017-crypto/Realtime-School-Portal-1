import { Router } from "express";
import multer from "multer";
import ExcelJS from "exceljs";
import { db } from "@workspace/db";
import {
  studentsTable,
  teachersTable,
  feesTable,
  diaryTable,
  syllabusTable,
  timetableTable,
  progressTable,
} from "@workspace/db/schema";
import { requireAuth } from "../lib/session";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/seed", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  await db.delete(diaryTable);
  await db.delete(syllabusTable);
  await db.delete(feesTable);
  await db.delete(progressTable);
  await db.delete(studentsTable);
  await db.delete(teachersTable);
  await db.delete(timetableTable);

  await db.insert(teachersTable).values([
    { id: "T001", name: "Sana Ahmed", password: "sana123", subject: "Science", joining: "2019-03-15", salary: 45000, phone: "0300-1111111", address: "Lahore", classes: ["9-A","9-B","10-A"] },
    { id: "T002", name: "Imran Khan", password: "imran123", subject: "Mathematics", joining: "2017-08-01", salary: 50000, phone: "0301-2222222", address: "Lahore", classes: ["9-A","10-A","10-B"] },
    { id: "T003", name: "Nadia Malik", password: "nadia123", subject: "English", joining: "2020-06-10", salary: 42000, phone: "0302-3333333", address: "Lahore", classes: ["9-A","9-B","10-A","10-B"] },
  ]);

  await db.insert(studentsTable).values([
    { id: "STU001", name: "Ahmad Ali", password: "ahmad123", class: "10-A", father: "Ali Hassan", phone: "0303-1111111", dob: "2010-03-15", address: "Lahore", rollNo: "01" },
    { id: "STU002", name: "Bilal Ahmed", password: "bilal123", class: "10-A", father: "Ahmed Raza", phone: "0304-2222222", dob: "2010-05-20", address: "Lahore", rollNo: "02" },
    { id: "STU003", name: "Zara Khan", password: "zara123", class: "10-B", father: "Khan Sahib", phone: "0305-3333333", dob: "2010-07-10", address: "Lahore", rollNo: "01" },
    { id: "STU004", name: "Hamza Tariq", password: "hamza123", class: "9-A", father: "Tariq Mehmood", phone: "0306-4444444", dob: "2011-01-05", address: "Lahore", rollNo: "01" },
  ]);

  await db.insert(feesTable).values([
    { studentId: "STU001", month: "January 2026", amount: 4500, paid: true, paidDate: "2026-01-03" },
    { studentId: "STU001", month: "February 2026", amount: 4500, paid: true, paidDate: "2026-02-05" },
    { studentId: "STU001", month: "March 2026", amount: 4500, paid: false, paidDate: null },
    { studentId: "STU001", month: "April 2026", amount: 4500, paid: false, paidDate: null },
    { studentId: "STU002", month: "January 2026", amount: 4500, paid: true, paidDate: "2026-01-04" },
    { studentId: "STU002", month: "February 2026", amount: 4500, paid: false, paidDate: null },
    { studentId: "STU002", month: "March 2026", amount: 4500, paid: false, paidDate: null },
    { studentId: "STU003", month: "January 2026", amount: 4200, paid: true, paidDate: "2026-01-06" },
    { studentId: "STU003", month: "February 2026", amount: 4200, paid: true, paidDate: "2026-02-08" },
    { studentId: "STU003", month: "March 2026", amount: 4200, paid: true, paidDate: "2026-03-02" },
    { studentId: "STU004", month: "January 2026", amount: 4000, paid: true, paidDate: "2026-01-05" },
    { studentId: "STU004", month: "February 2026", amount: 4000, paid: false, paidDate: null },
  ]);

  await db.insert(diaryTable).values([
    { studentId: "STU001", date: "2026-03-10", subject: "Mathematics", note: "Chapter 5 revision karo — quadratic equations. Kal test hoga.", teacherId: "T002" },
    { studentId: "STU001", date: "2026-03-09", subject: "English", note: "Essay: 'My Country'. 2 pages likhni hain.", teacherId: "T003" },
    { studentId: "STU001", date: "2026-03-08", subject: "Science", note: "Lab report submit karo Friday tak. Diagrams zaroor banao.", teacherId: "T001" },
    { studentId: "STU002", date: "2026-03-10", subject: "Mathematics", note: "Exercises 5.1 to 5.3 complete karo.", teacherId: "T002" },
    { studentId: "STU004", date: "2026-03-09", subject: "Science", note: "Chapter 3 yaad karo. MCQs practice karo.", teacherId: "T001" },
  ]);

  await db.insert(syllabusTable).values([
    { studentId: "STU001", subject: "Mathematics", totalChapters: 7, doneChapters: 5, lastTopic: "Quadratic Equations", teacherId: "T002" },
    { studentId: "STU001", subject: "Science", totalChapters: 6, doneChapters: 3, lastTopic: "Chemical Reactions", teacherId: "T001" },
    { studentId: "STU001", subject: "English", totalChapters: 10, doneChapters: 8, lastTopic: "Essay Writing", teacherId: "T003" },
    { studentId: "STU001", subject: "Urdu", totalChapters: 10, doneChapters: 6, lastTopic: "Ghazal — Iqbal", teacherId: "T003" },
    { studentId: "STU001", subject: "Islamiat", totalChapters: 10, doneChapters: 9, lastTopic: "Seerat-un-Nabi", teacherId: "T002" },
    { studentId: "STU002", subject: "Mathematics", totalChapters: 7, doneChapters: 4, lastTopic: "Linear Equations", teacherId: "T002" },
    { studentId: "STU002", subject: "English", totalChapters: 10, doneChapters: 6, lastTopic: "Comprehension", teacherId: "T003" },
    { studentId: "STU003", subject: "English", totalChapters: 10, doneChapters: 9, lastTopic: "Grammar", teacherId: "T003" },
    { studentId: "STU004", subject: "Science", totalChapters: 8, doneChapters: 5, lastTopic: "Forces & Motion", teacherId: "T001" },
  ]);

  await db.insert(timetableTable).values([
    { classId: "10-A", schedule: {
      Monday:    ["Mathematics","English","-","Science","Urdu","Islamiat"],
      Tuesday:   ["Science","Mathematics","-","English","Computer","Urdu"],
      Wednesday: ["English","Urdu","-","Mathematics","Islamiat","Science"],
      Thursday:  ["Islamiat","Science","-","Urdu","Mathematics","English"],
      Friday:    ["Quran","Mathematics","-","Science","English","Sports"],
      Saturday:  ["Computer","English","-","Mathematics","Science","Urdu"],
    }},
    { classId: "10-B", schedule: {
      Monday:    ["Science","Mathematics","-","English","Urdu","Computer"],
      Tuesday:   ["Mathematics","Urdu","-","Science","English","Islamiat"],
      Wednesday: ["English","Science","-","Urdu","Mathematics","Computer"],
      Thursday:  ["Urdu","English","-","Mathematics","Science","Islamiat"],
      Friday:    ["Quran","Science","-","Mathematics","English","Sports"],
      Saturday:  ["Islamiat","Mathematics","-","Science","Urdu","English"],
    }},
    { classId: "9-A", schedule: {
      Monday:    ["Physics","Chemistry","-","Biology","Mathematics","English"],
      Tuesday:   ["Mathematics","Physics","-","Chemistry","English","Urdu"],
      Wednesday: ["Biology","Mathematics","-","Physics","Urdu","Chemistry"],
      Thursday:  ["English","Biology","-","Mathematics","Chemistry","Physics"],
      Friday:    ["Quran","Mathematics","-","Physics","Chemistry","Sports"],
      Saturday:  ["Urdu","English","-","Biology","Mathematics","Physics"],
    }},
  ]);

  await db.insert(progressTable).values([
    { studentId: "STU001", attendance: 92, testAvg: 88, rank: 1, remarks: "Excellent student. Keep it up!", grade: "A+" },
    { studentId: "STU002", attendance: 85, testAvg: 75, rank: 4, remarks: "Good effort. Maths improve karo.", grade: "B+" },
    { studentId: "STU003", attendance: 97, testAvg: 91, rank: 1, remarks: "Outstanding performance!", grade: "A+" },
    { studentId: "STU004", attendance: 80, testAvg: 70, rank: 3, remarks: "Regular rehain aur mehnat karo.", grade: "B" },
  ]);

  res.json({ message: "Demo data seeded successfully!" });
});

// ─── EXCEL IMPORT ─────────────────────────────────────────────────────────────
router.post("/import", upload.single("file"), async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(req.file.buffer as any);

  function sheetToJson(sheet: ExcelJS.Worksheet): Record<string, string>[] {
    const headers: string[] = [];
    const rows: Record<string, string>[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          headers[colNumber] = String(cell.value ?? "");
        });
      } else {
        const obj: Record<string, string> = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          obj[headers[colNumber]] = String(cell.value ?? "");
        });
        rows.push(obj);
      }
    });
    return rows;
  }

  const result = {
    students: { imported: 0, skipped: 0, errors: [] as string[] },
    teachers: { imported: 0, skipped: 0, errors: [] as string[] },
    fees: { imported: 0, skipped: 0, errors: [] as string[] },
  };

  // ── Students sheet ──────────────────────────────────────────────────────────
  const studentsSheet = workbook.getWorksheet("Students") || workbook.getWorksheet("students") || workbook.getWorksheet("STUDENTS");
  if (studentsSheet) {
    const rows = sheetToJson(studentsSheet);
    for (const row of rows) {
      try {
        const id = String(row["ID"] || row["id"] || "").trim();
        const name = String(row["Name"] || row["name"] || "").trim();
        const password = String(row["Password"] || row["password"] || "1234").trim();
        const cls = String(row["Class"] || row["class"] || "").trim();
        const father = String(row["Father"] || row["father"] || row["Father Name"] || "").trim();
        const phone = String(row["Phone"] || row["phone"] || "").trim();
        const dob = String(row["DOB"] || row["dob"] || row["Date of Birth"] || "").trim();
        const address = String(row["Address"] || row["address"] || "").trim();
        const rollNo = String(row["Roll No"] || row["rollNo"] || row["RollNo"] || row["Roll"] || "").trim();

        if (!name || !cls) {
          result.students.skipped++;
          continue;
        }

        let finalId = id;
        if (!finalId) {
          const allStudents = await db.select({ id: studentsTable.id }).from(studentsTable);
          finalId = `STU${String(allStudents.length + 1).padStart(3, "0")}`;
        }

        // Upsert: insert or update
        const existing = await db.select({ id: studentsTable.id }).from(studentsTable)
          .where((t) => {
            const { eq } = require("drizzle-orm");
            return eq(t.id, finalId);
          });

        if (existing.length > 0) {
          const { eq } = await import("drizzle-orm");
          await db.update(studentsTable)
            .set({ name, class: cls, father, phone, dob, address, rollNo, ...(password ? { password } : {}) })
            .where(eq(studentsTable.id, finalId));
        } else {
          await db.insert(studentsTable).values({
            id: finalId,
            name,
            password,
            class: cls,
            father,
            phone,
            dob,
            address,
            rollNo,
          });
        }
        result.students.imported++;
      } catch (e: unknown) {
        result.students.errors.push(String(e));
      }
    }
  }

  // ── Teachers sheet ──────────────────────────────────────────────────────────
  const teachersSheet = workbook.getWorksheet("Teachers") || workbook.getWorksheet("teachers") || workbook.getWorksheet("TEACHERS");
  if (teachersSheet) {
    const rows = sheetToJson(teachersSheet);
    for (const row of rows) {
      try {
        const id = String(row["ID"] || row["id"] || "").trim();
        const name = String(row["Name"] || row["name"] || "").trim();
        const password = String(row["Password"] || row["password"] || "1234").trim();
        const subject = String(row["Subject"] || row["subject"] || "").trim();
        const joining = String(row["Joining"] || row["joining"] || row["Joining Date"] || "").trim();
        const salary = Number(row["Salary"] || row["salary"] || 0);
        const phone = String(row["Phone"] || row["phone"] || "").trim();
        const address = String(row["Address"] || row["address"] || "").trim();
        const classesRaw = String(row["Classes"] || row["classes"] || "").trim();
        const classes = classesRaw ? classesRaw.split(",").map((c) => c.trim()).filter(Boolean) : [];

        if (!name || !subject) {
          result.teachers.skipped++;
          continue;
        }

        let finalId = id;
        if (!finalId) {
          const allTeachers = await db.select({ id: teachersTable.id }).from(teachersTable);
          finalId = `T${String(allTeachers.length + 1).padStart(3, "0")}`;
        }

        const { eq } = await import("drizzle-orm");
        const existing = await db.select({ id: teachersTable.id }).from(teachersTable)
          .where(eq(teachersTable.id, finalId));

        if (existing.length > 0) {
          await db.update(teachersTable)
            .set({ name, subject, joining, salary, phone, address, classes, ...(password ? { password } : {}) })
            .where(eq(teachersTable.id, finalId));
        } else {
          await db.insert(teachersTable).values({
            id: finalId,
            name,
            password,
            subject,
            joining,
            salary,
            phone,
            address,
            classes,
          });
        }
        result.teachers.imported++;
      } catch (e: unknown) {
        result.teachers.errors.push(String(e));
      }
    }
  }

  // ── Fees sheet ───────────────────────────────────────────────────────────────
  const feesSheet = workbook.getWorksheet("Fees") || workbook.getWorksheet("fees") || workbook.getWorksheet("FEES");
  if (feesSheet) {
    const rows = sheetToJson(feesSheet);
    for (const row of rows) {
      try {
        const studentId = String(row["Student ID"] || row["studentId"] || row["StudentID"] || "").trim();
        const month = String(row["Month"] || row["month"] || "").trim();
        const amount = Number(row["Amount"] || row["amount"] || 0);
        const paidRaw = String(row["Paid"] || row["paid"] || "false").trim().toLowerCase();
        const paid = paidRaw === "true" || paidRaw === "yes" || paidRaw === "1";
        const paidDate = String(row["Paid Date"] || row["paidDate"] || row["PaidDate"] || "").trim() || null;

        if (!studentId || !month) {
          result.fees.skipped++;
          continue;
        }

        // Check student exists
        const { eq, and } = await import("drizzle-orm");
        const studentExists = await db.select({ id: studentsTable.id }).from(studentsTable)
          .where(eq(studentsTable.id, studentId));

        if (studentExists.length === 0) {
          result.fees.skipped++;
          result.fees.errors.push(`Student ${studentId} not found, skipping fee row`);
          continue;
        }

        // Check if fee for this month already exists
        const existingFee = await db.select({ id: feesTable.id }).from(feesTable)
          .where(and(eq(feesTable.studentId, studentId), eq(feesTable.month, month)));

        if (existingFee.length > 0) {
          await db.update(feesTable)
            .set({ amount, paid, paidDate: paidDate || null })
            .where(and(eq(feesTable.studentId, studentId), eq(feesTable.month, month)));
        } else {
          await db.insert(feesTable).values({ studentId, month, amount, paid, paidDate: paidDate || null });
        }
        result.fees.imported++;
      } catch (e: unknown) {
        result.fees.errors.push(String(e));
      }
    }
  }

  res.json({
    message: "Import complete",
    result,
    sheetsFound: workbook.worksheets.map((ws) => ws.name),
  });
});

// ─── DOWNLOAD TEMPLATE ────────────────────────────────────────────────────────
router.get("/import/template", async (req, res) => {
  const user = requireAuth(req, res);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return;
  }

  const workbook = new ExcelJS.Workbook();

  const studentsWS = workbook.addWorksheet("Students");
  studentsWS.addRows([
    ["ID", "Name", "Password", "Class", "Father", "Phone", "DOB", "Address", "Roll No"],
    ["STU001", "Ahmad Ali", "ahmad123", "10-A", "Ali Hassan", "0303-1111111", "2010-03-15", "Lahore", "01"],
    ["STU005", "Sara Bibi", "sara123", "9-A", "Bibi Khan", "0307-5555555", "2011-06-20", "Lahore", "05"],
  ]);

  const teachersWS = workbook.addWorksheet("Teachers");
  teachersWS.addRows([
    ["ID", "Name", "Password", "Subject", "Joining", "Salary", "Phone", "Address", "Classes"],
    ["T001", "Sana Ahmed", "sana123", "Science", "2019-03-15", "45000", "0300-1111111", "Lahore", "9-A,9-B,10-A"],
    ["T004", "New Teacher", "pass123", "History", "2024-01-01", "40000", "0300-9999999", "Lahore", "9-A,10-A"],
  ]);

  const feesWS = workbook.addWorksheet("Fees");
  feesWS.addRows([
    ["Student ID", "Month", "Amount", "Paid", "Paid Date"],
    ["STU001", "March 2026", "4500", "false", ""],
    ["STU002", "March 2026", "4500", "true", "2026-03-05"],
  ]);

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader("Content-Disposition", "attachment; filename=school-portal-template.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(Buffer.from(buffer));
});

export default router;
