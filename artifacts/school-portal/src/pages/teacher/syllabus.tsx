import { useState, useRef } from "react";
import { useGetMe, useGetTeachers, useGetStudents } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { Card, Select, Input, Button } from "@/components/ui-elements";
import { Save, Image, FileText, X, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function TeacherSyllabus() {
  const { data: me } = useGetMe();
  const { data: teachers } = useGetTeachers();
  const { data: students } = useGetStudents();

  const teacher = teachers?.find(t => t.id === me?.id);
  const myStudents = students?.filter(s => teacher?.classes.includes(s.class)) || [];

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState(teacher?.subject || "");
  const [totalChapters, setTotalChapters] = useState(10);
  const [doneChapters, setDoneChapters] = useState(0);
  const [lastTopic, setLastTopic] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { uploadFile: uploadImage, isUploading: uploadingImage } = useUpload();
  const { uploadFile: uploadPdf, isUploading: uploadingPdf } = useUpload();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removePdf = () => {
    setPdfFile(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setIsPending(true);

    try {
      let imageUrl: string | undefined;
      let pdfUrl: string | undefined;

      if (imageFile) {
        const result = await uploadImage(imageFile);
        if (!result) throw new Error("Image upload failed");
        imageUrl = `/api/storage${result.objectPath}`;
      }
      if (pdfFile) {
        const result = await uploadPdf(pdfFile);
        if (!result) throw new Error("PDF upload failed");
        pdfUrl = `/api/storage${result.objectPath}`;
      }

      const res = await fetch(`/api/syllabus/${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject,
          totalChapters: Number(totalChapters),
          doneChapters: Number(doneChapters),
          lastTopic,
          imageUrl,
          pdfUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to update syllabus");
      alert("Syllabus updated!");
      queryClient.invalidateQueries({ queryKey: [`/api/syllabus/${studentId}`] });
    } catch {
      alert("Failed to update syllabus.");
    } finally {
      setIsPending(false);
    }
  };

  const busy = isPending || uploadingImage || uploadingPdf;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Update Syllabus</h1>
        <p className="text-muted-foreground mt-1">Track course progress and attach materials</p>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Total Chapters</label>
              <Input type="number" min={1} value={totalChapters} onChange={e => setTotalChapters(Number(e.target.value))} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Chapters Completed</label>
              <Input type="number" min={0} max={totalChapters} value={doneChapters} onChange={e => setDoneChapters(Number(e.target.value))} required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Last Topic Covered</label>
              <Input value={lastTopic} onChange={e => setLastTopic(e.target.value)} required placeholder="e.g. Newton's Laws of Motion" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Book / Chapter Image <span className="text-xs opacity-60">(optional)</span>
              </label>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="syllabus-image" />
              {!imagePreview ? (
                <label htmlFor="syllabus-image" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Click to attach a book/chapter image</span>
                </label>
              ) : (
                <div className="relative inline-block">
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <img src={imagePreview} alt="preview" className="rounded-xl max-h-40 object-cover border border-white/10" />
                  <button type="button" onClick={removeImage} disabled={uploadingImage} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-500/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Syllabus PDF <span className="text-xs opacity-60">(optional)</span>
              </label>
              <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" id="syllabus-pdf" />
              {!pdfFile ? (
                <label htmlFor="syllabus-pdf" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Click to attach a PDF document</span>
                </label>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-white/10">
                  {uploadingPdf ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <FileText className="w-5 h-5 text-red-400" />}
                  <span className="text-sm flex-1 truncate">{pdfFile.name}</span>
                  <button type="button" onClick={removePdf} disabled={uploadingPdf} className="text-muted-foreground hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={busy}>
            <Save className="w-4 h-4" /> {busy ? "Uploading files…" : "Save Progress"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
