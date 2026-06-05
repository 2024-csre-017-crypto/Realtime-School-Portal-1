import { useState, useRef, useEffect } from "react";
import { useGetMe, useGetTeachers, useGetStudents } from "@workspace/api-client-react";
import { Card, Select, Input, Button, Badge } from "@/components/ui-elements";
import { ClipboardList, Image, X, Trash2, TrendingUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface TestResult {
  id: number;
  studentId: string;
  teacherId: string;
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

export default function TeacherTestReport() {
  const { data: me } = useGetMe();
  const { data: teachers } = useGetTeachers();
  const { data: students } = useGetStudents();

  const teacher = teachers?.find(t => t.id === me?.id);
  const myStudents = students?.filter(s => teacher?.classes.includes(s.class)) || [];

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState(teacher?.subject || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [obtainedMarks, setObtainedMarks] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!studentId) { setResults([]); return; }
    setLoadingResults(true);
    fetch(`/api/test-results/${studentId}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { setResults(data); setLoadingResults(false); })
      .catch(() => setLoadingResults(false));
  }, [studentId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    if (obtainedMarks > totalMarks) { alert("Obtained marks cannot exceed total marks."); return; }
    setIsPending(true);

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("subject", subject);
    formData.append("title", title);
    formData.append("date", date);
    formData.append("totalMarks", String(totalMarks));
    formData.append("obtainedMarks", String(obtainedMarks));
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`/api/test-results`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit");
      const newResult = await res.json();
      setResults(prev => [newResult, ...prev]);
      setTitle("");
      setObtainedMarks(0);
      removeImage();
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${studentId}`] });
    } catch {
      alert("Failed to submit test result.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: number, sid: string) => {
    if (!confirm("Delete this test result?")) return;
    await fetch(`/api/test-results/${id}`, { method: "DELETE", credentials: "include" });
    setResults(prev => prev.filter(r => r.id !== id));
    queryClient.invalidateQueries({ queryKey: [`/api/progress/${sid}`] });
  };

  const avg = results.length > 0
    ? Math.round(results.reduce((s, r) => s + pct(r.obtainedMarks, r.totalMarks), 0) / results.length)
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Daily Test Report</h1>
        <p className="text-muted-foreground mt-1">Add test results — progress is calculated automatically</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Select Student</label>
              <Select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                <option value="">-- Choose a student --</option>
                {myStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g. Mathematics" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Test Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Chapter 3 Quiz" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Date</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Total Marks</label>
              <Input type="number" min={1} value={totalMarks} onChange={e => setTotalMarks(Number(e.target.value))} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Obtained Marks</label>
              <Input type="number" min={0} max={totalMarks} value={obtainedMarks} onChange={e => setObtainedMarks(Number(e.target.value))} required />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 md:col-span-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Score Preview: </span>
              <span className={`text-lg font-bold ${gradeColor(pct(obtainedMarks, totalMarks))}`}>
                {pct(obtainedMarks, totalMarks)}%
              </span>
              <span className="text-xs text-muted-foreground ml-auto">({obtainedMarks} / {totalMarks})</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Test Paper / Answer Sheet Image <span className="text-xs opacity-60">(optional)</span>
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="test-image" />
              {!imagePreview ? (
                <label htmlFor="test-image" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Click to attach a test paper image</span>
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="rounded-xl max-h-48 object-cover border border-white/10" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-500/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isPending}>
            <ClipboardList className="w-4 h-4" /> Submit Test Result
          </Button>
        </form>
      </Card>

      {studentId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Previous Results</h2>
            {avg !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Average:</span>
                <span className={`font-bold ${gradeColor(avg)}`}>{avg}%</span>
              </div>
            )}
          </div>

          {loadingResults ? (
            <p className="text-muted-foreground text-sm">Loading results...</p>
          ) : results.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p>No test results yet for this student.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {results.map(r => {
                const p = pct(r.obtainedMarks, r.totalMarks);
                return (
                  <Card key={r.id} className="p-4 flex gap-4 items-start">
                    {r.image && (
                      <img src={r.image} alt="test" className="w-20 h-20 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-semibold">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.subject} · {format(new Date(r.date), "dd MMM yyyy")}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(r.id, r.studentId)}
                          className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full ${p >= 80 ? 'bg-emerald-500' : p >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${p}%` }} />
                        </div>
                        <span className={`font-bold text-sm ${gradeColor(p)}`}>{p}%</span>
                        <Badge variant="default">{r.obtainedMarks}/{r.totalMarks}</Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
