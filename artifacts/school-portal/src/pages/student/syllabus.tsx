import { useGetMe, useGetStudentSyllabus } from "@workspace/api-client-react";
import { Card } from "@/components/ui-elements";
import { FileText, Image as ImageIcon } from "lucide-react";

export default function StudentSyllabus() {
  const { data: me } = useGetMe();
  const { data: syllabus, isLoading } = useGetStudentSyllabus(me?.id || "", { query: { enabled: !!me?.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Syllabus Progress</h1>
        <p className="text-muted-foreground mt-1">Track your course completions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-muted-foreground col-span-2">Loading syllabus...</p>
        ) : syllabus?.length === 0 ? (
          <Card className="col-span-2 p-8 text-center text-muted-foreground">No syllabus records available.</Card>
        ) : (
          syllabus?.map((entry) => {
            const percentage = Math.round((entry.doneChapters / entry.totalChapters) * 100);
            const bookImage = (entry as any).bookImage as string | null;
            const pdfUrl = (entry as any).pdfUrl as string | null;
            return (
              <Card key={entry.id} className="p-6 flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  {bookImage && (
                    <a href={bookImage} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                      <img
                        src={bookImage}
                        alt="book"
                        className="w-20 h-24 object-cover rounded-lg border border-white/10 hover:opacity-80 transition-opacity"
                      />
                    </a>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{entry.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">Teacher: {entry.teacherId}</p>
                      </div>
                      <div className="text-2xl font-display font-bold text-primary">{percentage}%</div>
                    </div>

                    <div className="w-full bg-black/40 rounded-full h-2.5 mb-3 overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-primary to-cyan-400 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Chapters Done:</span>
                      <span className="font-medium text-white">{entry.doneChapters} / {entry.totalChapters}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Current Topic</span>
                  <p className="text-sm">{entry.lastTopic}</p>
                </div>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    View Syllabus PDF
                  </a>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
