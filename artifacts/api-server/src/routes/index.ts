import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import studentsRouter from "./students";
import teachersRouter from "./teachers";
import feesRouter from "./fees";
import diaryRouter from "./diary";
import syllabusRouter from "./syllabus";
import timetableRouter from "./timetable";
import progressRouter from "./progress";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/students", studentsRouter);
router.use("/teachers", teachersRouter);
router.use("/fees", feesRouter);
router.use("/diary", diaryRouter);
router.use("/syllabus", syllabusRouter);
router.use("/timetable", timetableRouter);
router.use("/progress", progressRouter);
router.use("/admin", adminRouter);

export default router;
