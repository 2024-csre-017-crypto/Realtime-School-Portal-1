import { useGetMe, useGetStudent } from "@workspace/api-client-react";
import { Card } from "@/components/ui-elements";
import { User, Phone, MapPin, Hash, BookOpen } from "lucide-react";

export default function StudentHome() {
  const { data: me } = useGetMe();
  const { data: student, isLoading } = useGetStudent(me?.id || "", { query: { enabled: !!me?.id } });

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/10 rounded w-3/4"></div></div></div>;
  if (!student) return <div>Profile not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome back, {student.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's your student profile overview.</p>
      </div>

      <Card className="p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-primary/30">
            {student.name.charAt(0)}
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><User className="w-4 h-4" /> Full Name</p>
              <p className="font-semibold text-lg">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><BookOpen className="w-4 h-4" /> Class</p>
              <p className="font-semibold text-lg">{student.class}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Hash className="w-4 h-4" /> Roll No</p>
              <p className="font-semibold text-lg">{student.rollNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><User className="w-4 h-4" /> Father's Name</p>
              <p className="font-semibold text-lg">{student.father}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Phone className="w-4 h-4" /> Phone</p>
              <p className="font-semibold text-lg">{student.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><MapPin className="w-4 h-4" /> Address</p>
              <p className="font-semibold text-lg">{student.address}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
