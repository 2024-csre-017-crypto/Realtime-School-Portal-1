import { useState } from "react";
import { useGetStudents, useCreateStudent, useDeleteStudent, useUpdateStudent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Input, Modal } from "@/components/ui-elements";
import { Plus, Trash2, Search, Pencil, CalendarRange } from "lucide-react";

const EMPTY_FORM = { name: "", password: "", class: "", father: "", phone: "", dob: "", address: "", rollNo: "", session: "" };
type FormData = typeof EMPTY_FORM;

interface StudentFormProps {
  formData: FormData;
  onChange: (d: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
  isEdit: boolean;
  submitLabel: string;
}

function StudentForm({ formData, onChange, onSubmit, onCancel, isPending, isEdit, submitLabel }: StudentFormProps) {
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...formData, [key]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Full Name *</label>
          <Input value={formData.name} onChange={set("name")} required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Password {isEdit ? "(blank = no change)" : "*"}
          </label>
          <Input type="password" value={formData.password} onChange={set("password")} required={!isEdit} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Class *</label>
          <Input value={formData.class} onChange={set("class")} required placeholder="e.g. 10-A" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Roll No *</label>
          <Input value={formData.rollNo} onChange={set("rollNo")} required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Father's Name *</label>
          <Input value={formData.father} onChange={set("father")} required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Phone *</label>
          <Input value={formData.phone} onChange={set("phone")} required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Date of Birth *</label>
          <Input type="date" value={formData.dob} onChange={set("dob")} required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <CalendarRange className="w-3 h-3" /> Session
          </label>
          <Input value={formData.session} onChange={set("session")} placeholder="e.g. 2026-2027" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-muted-foreground mb-1">Address *</label>
          <Input value={formData.address} onChange={set("address")} required />
        </div>
      </div>
      <div className="pt-2 flex gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1" isLoading={isPending}>{submitLabel}</Button>
      </div>
    </form>
  );
}

export default function AdminStudents() {
  const { data: students, isLoading } = useGetStudents();
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useCreateStudent();
  const { mutate: update, isPending: isUpdating } = useUpdateStudent();
  const { mutate: remove } = useDeleteStudent();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/students"] });

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditStudentId(null);
    setEditStudentName("");
    setFormData(EMPTY_FORM);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create({ data: formData as any }, { onSuccess: () => { invalidate(); closeModals(); } });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentId) return;
    update({ studentId: editStudentId, data: formData as any }, { onSuccess: () => { invalidate(); closeModals(); } });
  };

  const openEdit = (s: NonNullable<typeof students>[number]) => {
    setEditStudentId(s.id);
    setEditStudentName(s.name);
    setFormData({
      name: s.name, password: "", class: s.class, father: s.father,
      phone: s.phone, dob: s.dob, address: s.address, rollNo: s.rollNo,
      session: (s as any).session || "",
    });
  };

  const filteredStudents = students?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search) ||
    s.id.includes(search) ||
    ((s as any).session || "").includes(search)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student directory</p>
        </div>
        <Button onClick={() => { setFormData(EMPTY_FORM); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, roll no, or session..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-sm">
                <th className="pb-3 px-4 font-medium">ID / Roll No</th>
                <th className="pb-3 px-4 font-medium">Name</th>
                <th className="pb-3 px-4 font-medium">Class</th>
                <th className="pb-3 px-4 font-medium">Session</th>
                <th className="pb-3 px-4 font-medium">Phone</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No students found</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-primary">{student.id}</div>
                      <div className="text-xs text-muted-foreground">Roll: {student.rollNo}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">{student.name}</td>
                    <td className="py-4 px-4">{student.class}</td>
                    <td className="py-4 px-4">
                      {(student as any).session ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                          <CalendarRange className="w-3 h-3" />
                          {(student as any).session}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">{student.phone}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" className="p-2 min-w-0" onClick={() => openEdit(student as any)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" className="p-2 min-w-0" onClick={() => {
                          if (confirm(`Delete ${student.name}?`)) {
                            remove({ studentId: student.id }, { onSuccess: invalidate });
                          }
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Student">
        <StudentForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleCreate}
          onCancel={closeModals}
          isPending={isCreating}
          isEdit={false}
          submitLabel="Create Student"
        />
      </Modal>

      <Modal isOpen={!!editStudentId} onClose={closeModals} title={`Edit — ${editStudentName}`}>
        <StudentForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleEdit}
          onCancel={closeModals}
          isPending={isUpdating}
          isEdit={true}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
}
