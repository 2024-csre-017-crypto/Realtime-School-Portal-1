import { useState } from "react";
import { useGetTeachers, useCreateTeacher, useDeleteTeacher } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Input, Modal, Badge } from "@/components/ui-elements";
import { Plus, Trash2, Search } from "lucide-react";

export default function AdminTeachers() {
  const { data: teachers, isLoading } = useGetTeachers();
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", password: "", subject: "", joining: "", salary: 0, phone: "", address: "", classes: ""
  });

  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useCreateTeacher();
  const { mutate: remove } = useDeleteTeacher();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create({ 
      data: { 
        ...formData, 
        salary: Number(formData.salary),
        classes: formData.classes.split(',').map(c => c.trim()).filter(Boolean)
      } 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/teachers"] });
        setIsAddModalOpen(false);
        setFormData({ name: "", password: "", subject: "", joining: "", salary: 0, phone: "", address: "", classes: "" });
      }
    });
  };

  const filteredTeachers = teachers?.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Teachers</h1>
          <p className="text-muted-foreground mt-1">Manage staff directory</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Teacher
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search teachers..." 
            className="pl-10" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-sm">
                <th className="pb-3 px-4 font-medium">ID / Name</th>
                <th className="pb-3 px-4 font-medium">Subject</th>
                <th className="pb-3 px-4 font-medium">Classes</th>
                <th className="pb-3 px-4 font-medium">Phone</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No teachers found</td></tr>
              ) : (
                filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-xs text-primary">{teacher.id}</div>
                    </td>
                    <td className="py-4 px-4"><Badge>{teacher.subject}</Badge></td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.map(c => <Badge key={c} variant="neutral">{c}</Badge>)}
                      </div>
                    </td>
                    <td className="py-4 px-4">{teacher.phone}</td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="danger" 
                        className="p-2 min-w-0" 
                        onClick={() => {
                          if (confirm("Are you sure?")) {
                            remove({ teacherId: teacher.id }, {
                              onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/teachers"] })
                            });
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Teacher">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Full Name</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Password</label>
              <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Subject</label>
              <Input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Classes (comma separated)</label>
              <Input value={formData.classes} onChange={e => setFormData({...formData, classes: e.target.value})} required placeholder="10A, 10B" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Joining Date</label>
              <Input type="date" value={formData.joining} onChange={e => setFormData({...formData, joining: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Salary</label>
              <Input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Phone</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Address</label>
              <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>Create Teacher</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
