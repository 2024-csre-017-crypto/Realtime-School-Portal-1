# Workspace

## Overview

School Portal — a full-stack school management system with real-time database persistence. Three user roles: Admin, Teacher, Student.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── school-portal/      # React frontend (preview at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## School Portal Features

### Login
- Role selector: Admin / Teacher / Student
- Session-based auth via signed cookies

### Student Portal
- **Home**: Student info card
- **Diary**: Homework/notes from teachers
- **Syllabus**: Subject progress bars with chapter tracking
- **Timetable**: Weekly class schedule
- **Fees**: Monthly fee payment status
- **Progress**: Attendance %, test avg, grade, remarks

### Teacher Portal
- **Home**: Teacher info
- **Diary**: Add diary entries for students in their classes
- **Syllabus**: Update syllabus progress per student
- **My Classes**: View assigned classes

### Admin Portal
- **Dashboard**: Summary stats
- **Students**: Full CRUD (add/edit/delete)
- **Teachers**: Full CRUD (add/edit/delete)
- **Fees**: Manage fee records, mark paid/unpaid
- **Settings**: Seed demo data button

## Demo Credentials
- **Admin**: ID `admin`, Password `admin123`
- **Teacher (Science)**: ID `T001`, Password `sana123`
- **Teacher (Math)**: ID `T002`, Password `imran123`
- **Teacher (English)**: ID `T003`, Password `nadia123`
- **Student (Ahmad)**: ID `STU001`, Password `ahmad123`
- **Student (Bilal)**: ID `STU002`, Password `bilal123`
- **Student (Zara)**: ID `STU003`, Password `zara123`
- **Student (Hamza)**: ID `STU004`, Password `hamza123`

## Database Schema

Tables: `students`, `teachers`, `fees`, `diary`, `syllabus`, `timetable`, `progress`

Push schema changes: `pnpm --filter @workspace/db run push`

## API Routes

All routes under `/api`:
- `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- CRUD `/students`, `/teachers`
- `/fees/:studentId`, `/diary/:studentId`, `/syllabus/:studentId`
- `/timetable/:classId`, `/progress/:studentId`
- `POST /admin/seed` — re-seed demo data
