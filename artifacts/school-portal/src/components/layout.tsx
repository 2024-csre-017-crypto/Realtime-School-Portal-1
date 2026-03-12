import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  Home, BookOpen, GraduationCap, Calendar, CreditCard, 
  TrendingUp, Users, Settings, LayoutDashboard, LogOut, 
  BookMarked
} from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();
        window.location.href = "/login";
      }
    });
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  let navItems = [];
  if (user.role === "admin") {
    navItems = [
      { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/students", label: "Students", icon: Users },
      { path: "/admin/teachers", label: "Teachers", icon: BookMarked },
      { path: "/admin/fees", label: "Fees", icon: CreditCard },
      { path: "/admin/settings", label: "Settings", icon: Settings },
    ];
  } else if (user.role === "teacher") {
    navItems = [
      { path: "/teacher", label: "Home", icon: Home },
      { path: "/teacher/diary", label: "Diary", icon: BookOpen },
      { path: "/teacher/syllabus", label: "Syllabus", icon: GraduationCap },
      { path: "/teacher/classes", label: "My Classes", icon: Users },
    ];
  } else {
    navItems = [
      { path: "/student", label: "Home", icon: Home },
      { path: "/student/diary", label: "Diary", icon: BookOpen },
      { path: "/student/syllabus", label: "Syllabus", icon: GraduationCap },
      { path: "/student/timetable", label: "Timetable", icon: Calendar },
      { path: "/student/fees", label: "Fees", icon: CreditCard },
      { path: "/student/progress", label: "Progress", icon: TrendingUp },
    ];
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-white/5 px-4 py-8 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden shrink-0">
            <img src="/images/school-logo.jpeg" alt="Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight">The Excel School</h1>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== `/${user.role}` && location.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group",
                isActive ? "text-white bg-white/10" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20" />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-card/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              <img src="/images/school-logo.jpeg" alt="Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <h1 className="font-display font-bold text-sm">The Excel School</h1>
          </div>
          <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== `/${user.role}` && location.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
