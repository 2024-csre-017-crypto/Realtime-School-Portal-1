import { useState } from "react";
import { useGetMe, useGetTeachers, useGetStudents, useAddSyllabusEntry } from "@workspace/api-client-react";
import { Card, Select, Input, Button } from "@/components/ui-elements";
import { Save } from "lucide-react";
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

  const { mutate: updateSyllabus, isPending } = useAddSyllabusEntry();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    
    updateSyllabus({ 
      studentId, 
      data: { subject, totalChapters: Number(totalChapters), doneChapters: Number(doneChapters), lastTopic } 
    }, {
      onSuccess: () => {
        alert("Syllabus updated!");
        queryClient.invalidateQueries({ queryKey: [`/api/syllabus/${studentId}`]});
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Update Syllabus</h1>
        <p className="text-muted-foreground mt-1">Track course progress for your students</p>
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
          </div>
          
          <Button type="submit" className="w-full" isLoading={isPending}>
            <Save className="w-4 h-4" /> Save Progress
          </Button>
        </form>
      </Card>
    </div>
  );
}
