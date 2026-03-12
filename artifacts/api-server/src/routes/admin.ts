import { Router } from "express";
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

export default router;
