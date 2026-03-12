import { pgTable, text, integer, boolean, serial, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  class: text("class").notNull(),
  father: text("father").notNull(),
  phone: text("phone").notNull(),
  dob: text("dob").notNull(),
  address: text("address").notNull(),
  rollNo: text("roll_no").notNull(),
});

export const teachersTable = pgTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  subject: text("subject").notNull(),
  joining: text("joining").notNull(),
  salary: real("salary").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  classes: jsonb("classes").notNull().$type<string[]>(),
});

export const feesTable = pgTable("fees", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  amount: real("amount").notNull(),
  paid: boolean("paid").notNull().default(false),
  paidDate: text("paid_date"),
});

export const diaryTable = pgTable("diary", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  subject: text("subject").notNull(),
  note: text("note").notNull(),
  teacherId: text("teacher_id").notNull().references(() => teachersTable.id, { onDelete: "cascade" }),
});

export const syllabusTable = pgTable("syllabus", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  totalChapters: integer("total_chapters").notNull(),
  doneChapters: integer("done_chapters").notNull(),
  lastTopic: text("last_topic").notNull(),
  teacherId: text("teacher_id").notNull().references(() => teachersTable.id, { onDelete: "cascade" }),
});

export const timetableTable = pgTable("timetable", {
  classId: text("class_id").primaryKey(),
  schedule: jsonb("schedule").notNull().$type<Record<string, string[]>>(),
});

export const progressTable = pgTable("progress", {
  studentId: text("student_id").primaryKey().references(() => studentsTable.id, { onDelete: "cascade" }),
  attendance: real("attendance").notNull().default(0),
  testAvg: real("test_avg").notNull().default(0),
  rank: integer("rank").notNull().default(1),
  remarks: text("remarks").notNull().default(""),
  grade: text("grade").notNull().default(""),
});

export const insertStudentSchema = createInsertSchema(studentsTable);
export const insertTeacherSchema = createInsertSchema(teachersTable);
export const insertFeeSchema = createInsertSchema(feesTable).omit({ id: true });
export const insertDiarySchema = createInsertSchema(diaryTable).omit({ id: true });
export const insertSyllabusSchema = createInsertSchema(syllabusTable).omit({ id: true });

export type Student = typeof studentsTable.$inferSelect;
export type Teacher = typeof teachersTable.$inferSelect;
export type Fee = typeof feesTable.$inferSelect;
export type DiaryEntry = typeof diaryTable.$inferSelect;
export type SyllabusEntry = typeof syllabusTable.$inferSelect;
export type Timetable = typeof timetableTable.$inferSelect;
export type Progress = typeof progressTable.$inferSelect;
