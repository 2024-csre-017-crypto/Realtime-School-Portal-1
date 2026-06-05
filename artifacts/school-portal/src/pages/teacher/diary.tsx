import { useState, useRef } from "react";
import { useGetMe, useGetTeachers, useGetStudents } from "@workspace/api-client-react";
import { Card, Select, Input, Button } from "@/components/ui-elements";
import { Send, Image, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function TeacherDiary() {
  const { data: me } = useGetMe();
  const { data: teachers } = useGetTeachers();
  const { data: students } = useGetStudents();
  
  const teacher = teachers?.find(t => t.id === me?.id);
  const myStudents = students?.filter(s => teacher?.classes.includes(s.class)) || [];

  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState(teacher?.subject || "");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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
    setIsPending(true);

    const formData = new FormData();
    formData.append("date", date);
    formData.append("subject", subject);
    formData.append("note", note);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`/api/diary/${studentId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to post entry");
      alert("Diary entry posted!");
      setNote("");
      removeImage();
      queryClient.invalidateQueries({ queryKey: [`/api/diary/${studentId}`] });
    } catch {
      alert("Failed to post diary entry.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Write Diary</h1>
        <p className="text-muted-foreground mt-1">Send notes and images to your students</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Select Student</label>
              <Select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                <option value="">-- Choose a student --</option>
                {myStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Date</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                placeholder="Write your note here..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Attach Image <span className="text-xs opacity-60">(optional)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="diary-image"
              />
              {!imagePreview ? (
                <label
                  htmlFor="diary-image"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Click to attach an image</span>
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="rounded-xl max-h-48 object-cover border border-white/10" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isPending}>
            <Send className="w-4 h-4" /> Send Entry
          </Button>
        </form>
      </Card>
    </div>
  );
}
