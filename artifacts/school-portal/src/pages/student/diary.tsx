import { useGetMe, useGetStudentDiary } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { format } from "date-fns";
import { BookOpen } from "lucide-react";

export default function StudentDiary() {
  const { data: me } = useGetMe();
  const { data: diary, isLoading } = useGetStudentDiary(me?.id || "", { query: { enabled: !!me?.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Digital Diary</h1>
        <p className="text-muted-foreground mt-1">Teacher notes and assignments</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading diary...</p>
        ) : diary?.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p>No diary entries yet.</p>
          </Card>
        ) : (
          diary?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
            <Card key={entry.id} className="p-5 flex flex-col sm:flex-row gap-6">
              <div className="sm:w-32 flex-shrink-0 text-center sm:text-left sm:border-r border-white/10 sm:pr-4">
                <div className="text-3xl font-bold text-primary">{format(new Date(entry.date), "dd")}</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{format(new Date(entry.date), "MMM yyyy")}</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="primary">{entry.subject}</Badge>
                  <span className="text-xs text-muted-foreground">By: {entry.teacherId}</span>
                </div>
                <p className="text-foreground leading-relaxed mt-3">{entry.note}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
