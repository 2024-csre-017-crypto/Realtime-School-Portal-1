import { useGetMe, useGetStudentDiary } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { format } from "date-fns";
import { BookOpen, Image as ImageIcon } from "lucide-react";

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
          diary?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
            <Card key={entry.id} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-6">
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
              </div>
              {(entry as any).image && (
                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <ImageIcon className="w-3.5 h-3.5" /> Attached Image
                  </div>
                  <a href={(entry as any).image} target="_blank" rel="noopener noreferrer">
                    <img
                      src={(entry as any).image}
                      alt="diary attachment"
                      className="rounded-xl max-h-64 object-contain border border-white/10 hover:opacity-90 transition-opacity cursor-zoom-in"
                    />
                  </a>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
