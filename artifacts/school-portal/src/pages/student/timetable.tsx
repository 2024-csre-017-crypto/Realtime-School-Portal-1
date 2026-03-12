import { useGetMe, useGetStudent, useGetTimetable } from "@workspace/api-client-react";
import { Card } from "@/components/ui-elements";

export default function StudentTimetable() {
  const { data: me } = useGetMe();
  const { data: student } = useGetStudent(me?.id || "", { query: { enabled: !!me?.id } });
  const { data: timetable, isLoading } = useGetTimetable(student?.class || "", { query: { enabled: !!student?.class } });

  const periods = ["8:00 AM", "9:00 AM", "10:00 AM", "Break", "11:30 AM", "12:30 PM", "1:30 PM"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Class Timetable</h1>
        <p className="text-muted-foreground mt-1">Your weekly schedule for Class {student?.class}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40">
                <th className="p-4 font-semibold border-b border-r border-white/5 w-32">Day / Time</th>
                {periods.map(p => (
                  <th key={p} className="p-4 font-semibold border-b border-r border-white/5 text-center text-sm">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading timetable...</td></tr>
              ) : !timetable ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Timetable not set for this class yet.</td></tr>
              ) : (
                days.map(day => (
                  <tr key={day} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium border-r border-white/5 bg-black/20">{day}</td>
                    {periods.map((period, i) => {
                      if (period === "Break") {
                        return i === 3 ? <td key={i} rowSpan={5} className="p-4 text-center font-bold text-muted-foreground border-r border-white/5 bg-white/5 uppercase tracking-widest hidden md:table-cell" style={{ writingMode: 'vertical-lr' }}>LUNCH BREAK</td> : null;
                      }
                      const subjectIndex = period === "Break" ? -1 : i > 3 ? i - 1 : i;
                      const subject = timetable.schedule?.[day]?.[subjectIndex] || "-";
                      return (
                        <td key={i} className="p-4 text-center border-r border-white/5">
                          <span className={subject !== "-" ? "px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium" : "text-muted-foreground"}>
                            {subject}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
