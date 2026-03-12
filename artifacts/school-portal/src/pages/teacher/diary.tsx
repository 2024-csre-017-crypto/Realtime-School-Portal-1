import { useState } from "react";
import { useGetMe, useGetTeachers, useGetStudents, useAddDiaryEntry } from "@workspace/api-client-react";
import { Card, Select, Input, Button } from "@/components/ui-elements";
import { Send } from "lucide-react";
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

  const { mutate: addEntry, isPending } = useAddDiaryEntry();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    
    addEntry({ studentId, data: { date, subject, note } }, {
      onSuccess: () => {
        alert("Diary entry posted!");
        setNote("");
        queryClient.invalidateQueries({ queryKey: [`/api/diary/${studentId}`]});
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Write Diary</h1>
        <p className="text-muted-foreground mt-1">Send notes to your students</p>
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
              ></textarea>
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
