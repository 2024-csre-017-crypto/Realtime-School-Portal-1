import { useGetMe, useGetTeachers } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { Phone, MapPin, Calendar, DollarSign, Users } from "lucide-react";

export default function TeacherHome() {
  const { data: me } = useGetMe();
  const { data: teachers, isLoading } = useGetTeachers();

  if (isLoading) return <div>Loading...</div>;
  const teacher = teachers?.find(t => t.id === me?.id);
  
  if (!teacher) return <div>Profile not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome, {teacher.name}!</h1>
        <p className="text-muted-foreground mt-1">Teacher Dashboard</p>
      </div>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-6 w-full">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                <Badge variant="primary" className="mt-1">{teacher.subject}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><Phone className="w-5 h-5 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{teacher.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><MapPin className="w-5 h-5 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{teacher.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><Calendar className="w-5 h-5 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium">{teacher.joining}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><DollarSign className="w-5 h-5 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-medium">${teacher.salary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-64 bg-black/20 rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Users className="w-5 h-5" /> Assigned Classes</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.classes.map(c => (
                <div key={c} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center flex-1 min-w-[80px]">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
