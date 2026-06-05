import { useEffect, useState } from "react";
import { useGetMe, useGetStudentProgress } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { Trophy, TrendingUp, UserCheck, MessageSquare, ClipboardList } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { format } from "date-fns";

interface TestResult {
  id: number;
  studentId: string;
  subject: string;
  title: string;
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  image: string | null;
}

function pct(obtained: number, total: number) {
  return total > 0 ? Math.round((obtained / total) * 100) : 0;
}

function gradeColor(p: number) {
  if (p >= 80) return "text-emerald-400";
  if (p >= 60) return "text-yellow-400";
  return "text-red-400";
}

export default function StudentProgress() {
  const { data: me } = useGetMe();
  const { data: progress, isLoading } = useGetStudentProgress(me?.id || "", { query: { enabled: !!me?.id } });
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (!me?.id) return;
    setLoadingResults(true);
    fetch(`/api/test-results/${me.id}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { setResults(data); setLoadingResults(false); })
      .catch(() => setLoadingResults(false));
  }, [me?.id]);

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
          {progress.grade && <Badge variant="primary" className="mt-2">Grade {progress.grade}</Badge>}
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

      {progress.remarks && (
        <Card className="p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" /> Teacher Remarks
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-4 py-2 bg-black/20 rounded-r-xl">
            "{progress.remarks}"
          </p>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" /> Test Results
        </h3>
        {loadingResults ? (
          <p className="text-muted-foreground text-sm">Loading results...</p>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No test results yet.</p>
        ) : (
          <div className="space-y-3">
            {results.map(r => {
              const p = pct(r.obtainedMarks, r.totalMarks);
              return (
                <div key={r.id} className="flex gap-4 items-start p-3 rounded-xl bg-black/20 border border-white/5">
                  {r.image && (
                    <a href={r.image} target="_blank" rel="noopener noreferrer">
                      <img src={r.image} alt="test" className="w-16 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0 hover:opacity-80 transition-opacity" />
                    </a>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <p className="font-semibold text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.subject} · {format(new Date(r.date), "dd MMM yyyy")}</p>
                      </div>
                      <span className={`font-bold text-lg ${gradeColor(p)}`}>{p}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p >= 80 ? 'bg-emerald-500' : p >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.obtainedMarks}/{r.totalMarks}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
