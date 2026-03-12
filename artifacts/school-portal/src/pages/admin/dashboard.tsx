import { useGetStudents, useGetTeachers } from "@workspace/api-client-react";
import { Card } from "@/components/ui-elements";
import { Users, GraduationCap, School } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: students } = useGetStudents();
  const { data: teachers } = useGetTeachers();

  // Generate some mock chart data based on student counts by class
  const classData = students?.reduce((acc: any, student) => {
    const cls = student.class;
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(classData || {}).map(([name, count]) => ({
    name: `Class ${name}`,
    students: count
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your school metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Students</p>
            <h3 className="text-3xl font-bold">{students?.length || 0}</h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Teachers</p>
            <h3 className="text-3xl font-bold">{teachers?.length || 0}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-500">
            <School className="w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Active Classes</p>
            <h3 className="text-3xl font-bold">{Object.keys(classData || {}).length}</h3>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Students by Class</h3>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#131A2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
