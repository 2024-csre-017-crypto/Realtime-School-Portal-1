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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Nexus Portal</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
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
