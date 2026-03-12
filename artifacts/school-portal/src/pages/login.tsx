import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin, LoginRequestRole } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Input, Button } from "@/components/ui-elements";
import { GraduationCap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [role, setRole] = useState<LoginRequestRole>("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login({ data: { role, id, password } }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation(`/${data.role}`);
      },
      onError: (err: any) => {
        setError(err.message || "Invalid credentials");
      }
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/login-bg.png`} 
          alt="Login Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-primary/30 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/school-logo.jpeg`}
              alt="The Excel School Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">The Excel School</h1>
          <p className="text-sm text-primary/80 font-medium mb-1">Principal: Sir Ahmad Raza</p>
          <p className="text-muted-foreground text-sm">+92 306 2549080</p>
          <a
            href="https://www.instagram.com/__razacampusvibes__?igsh=NDZvZjRtczU0YnU2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full text-xs font-semibold transition-all
              bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90 shadow-lg shadow-pink-500/20"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @razacampusvibes
          </a>
        </div>

        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
              {(["student", "teacher", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                    role === r 
                      ? "bg-white/10 text-white shadow-sm" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">User ID</label>
                <Input 
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="Enter your ID..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password</label>
                <Input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-lg" isLoading={isPending}>
              Sign In
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
