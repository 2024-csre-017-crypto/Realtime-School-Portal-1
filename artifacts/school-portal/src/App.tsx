import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";

// Auth
import Login from "@/pages/login";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminStudents from "@/pages/admin/students";
import AdminTeachers from "@/pages/admin/teachers";
import AdminFees from "@/pages/admin/fees";
import AdminSettings from "@/pages/admin/settings";
import AdminNotifications from "@/pages/admin/notifications";

// Teacher Pages
import TeacherHome from "@/pages/teacher/home";
import TeacherDiary from "@/pages/teacher/diary";
import TeacherSyllabus from "@/pages/teacher/syllabus";
import TeacherClasses from "@/pages/teacher/classes";
import TeacherTestReport from "@/pages/teacher/test-report";

// Student Pages
import StudentHome from "@/pages/student/home";
import StudentDiary from "@/pages/student/diary";
import StudentSyllabus from "@/pages/student/syllabus";
import StudentTimetable from "@/pages/student/timetable";
import StudentFees from "@/pages/student/fees";
import StudentProgress from "@/pages/student/progress";

const queryClient = new QueryClient();

function RedirectToLogin() {
  const [, setLocation] = useLocation();
  // using setTimeout to avoid rendering state updates warning during mount
  setTimeout(() => setLocation('/login'), 0);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        {() => <Layout><AdminDashboard /></Layout>}
      </Route>
      <Route path="/admin/students">
        {() => <Layout><AdminStudents /></Layout>}
      </Route>
      <Route path="/admin/teachers">
        {() => <Layout><AdminTeachers /></Layout>}
      </Route>
      <Route path="/admin/fees">
        {() => <Layout><AdminFees /></Layout>}
      </Route>
      <Route path="/admin/settings">
        {() => <Layout><AdminSettings /></Layout>}
      </Route>
      <Route path="/admin/notifications">
        {() => <Layout><AdminNotifications /></Layout>}
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher">
        {() => <Layout><TeacherHome /></Layout>}
      </Route>
      <Route path="/teacher/diary">
        {() => <Layout><TeacherDiary /></Layout>}
      </Route>
      <Route path="/teacher/syllabus">
        {() => <Layout><TeacherSyllabus /></Layout>}
      </Route>
      <Route path="/teacher/classes">
        {() => <Layout><TeacherClasses /></Layout>}
      </Route>
      <Route path="/teacher/test-report">
        {() => <Layout><TeacherTestReport /></Layout>}
      </Route>

      {/* Student Routes */}
      <Route path="/student">
        {() => <Layout><StudentHome /></Layout>}
      </Route>
      <Route path="/student/diary">
        {() => <Layout><StudentDiary /></Layout>}
      </Route>
      <Route path="/student/syllabus">
        {() => <Layout><StudentSyllabus /></Layout>}
      </Route>
      <Route path="/student/timetable">
        {() => <Layout><StudentTimetable /></Layout>}
      </Route>
      <Route path="/student/fees">
        {() => <Layout><StudentFees /></Layout>}
      </Route>
      <Route path="/student/progress">
        {() => <Layout><StudentProgress /></Layout>}
      </Route>

      <Route path="/">
        <RedirectToLogin />
      </Route>
      
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
