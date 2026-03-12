import { useGetMe, useGetStudentProgress } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { Trophy, TrendingUp, UserCheck, MessageSquare } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export default function StudentProgress() {
  const { data: me } = useGetMe();
  const { data: progress, isLoading } = useGetStudentProgress(me?.id || "", { query: { enabled: !!me?.id } });

  if (isLoading) return <div>Loading progress...</div>;
  if (!progress) return <Card className="p-8 text-center text-muted-foreground">No progress report generated yet.</Card>;

  const attendanceData = [{ name: 'Attendance', value: progress.attendance, fill: 'hsl(var(--primary))' }];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Academic Progress</h1>
        <p className="text-muted-foreground mt-1">Your performance summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Class Rank</h3>
          <p className="text-4xl font-display font-black text-white mt-2">#{progress.rank}</p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Test Average</h3>
          <p className="text-4xl font-display font-black text-white mt-2">{progress.testAvg}%</p>
          <Badge variant="primary" className="mt-2">Grade {progress.grade}</Badge>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={attendanceData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 relative z-10">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold relative z-10">Attendance</h3>
          <p className="text-4xl font-display font-black text-white mt-2 relative z-10">{progress.attendance}%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" /> Teacher Remarks
        </h3>
        <p className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-4 py-2 bg-black/20 rounded-r-xl">
          "{progress.remarks}"
        </p>
      </Card>
    </div>
  );
}
