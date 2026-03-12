import { useGetMe, useGetTeachers, useGetStudents } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { Users } from "lucide-react";

export default function TeacherClasses() {
  const { data: me } = useGetMe();
  const { data: teachers } = useGetTeachers();
  const { data: students } = useGetStudents();
  
  const teacher = teachers?.find(t => t.id === me?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Classes</h1>
        <p className="text-muted-foreground mt-1">Students enrolled in your assigned sections</p>
      </div>

      {teacher?.classes.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No classes assigned to you.</Card>
      ) : (
        <div className="space-y-8">
          {teacher?.classes.map(cls => {
            const classStudents = students?.filter(s => s.class === cls) || [];
            return (
              <Card key={cls} className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="p-2 bg-primary/20 text-primary rounded-xl"><Users className="w-6 h-6" /></span>
                    Class {cls}
                  </h2>
                  <Badge variant="primary">{classStudents.length} Students</Badge>
                </div>
                
                {classStudents.length === 0 ? (
                  <p className="text-muted-foreground italic">No students found in this class.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classStudents.map(student => (
                      <div key={student.id} className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{student.name}</div>
                          <div className="text-xs text-muted-foreground">Roll: {student.rollNo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
