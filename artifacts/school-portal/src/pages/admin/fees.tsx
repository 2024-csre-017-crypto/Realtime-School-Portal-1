import { useState } from "react";
import { useGetStudents, useGetStudentFees, useAddFeeRecord, useUpdateFeeRecord } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, Input, Modal, Badge, Select } from "@/components/ui-elements";
import { Plus, CheckCircle, Search, FileText } from "lucide-react";
import { format } from "date-fns";

export default function AdminFees() {
  const { data: students } = useGetStudents();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const { data: fees, isLoading } = useGetStudentFees(selectedStudentId, { query: { enabled: !!selectedStudentId } });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ month: "", amount: 0, paid: false });

  const queryClient = useQueryClient();
  const { mutate: addFee, isPending: isAdding } = useAddFeeRecord();
  const { mutate: updateFee } = useUpdateFeeRecord();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    addFee({ studentId: selectedStudentId, data: { ...formData, amount: Number(formData.amount) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/fees/${selectedStudentId}`] });
        setIsAddModalOpen(false);
        setFormData({ month: "", amount: 0, paid: false });
      }
    });
  };

  const markPaid = (feeId: number) => {
    updateFee({ studentId: selectedStudentId, feeId, data: { paid: true, paidDate: new Date().toISOString() } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/fees/${selectedStudentId}`] })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Fee Management</h1>
          <p className="text-muted-foreground mt-1">Track and collect student fees</p>
        </div>
        {selectedStudentId && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Fee Record
          </Button>
        )}
      </div>

      <Card className="p-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Select Student</label>
        <Select 
          value={selectedStudentId} 
          onChange={e => setSelectedStudentId(e.target.value)}
          className="mb-6"
        >
          <option value="">-- Choose a student --</option>
          {students?.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.id}) - Class {s.class}</option>
          ))}
        </Select>

        {!selectedStudentId ? (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Select a student to view their fee records.</p>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading fee records...</div>
        ) : fees?.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No fee records found for this student.</div>
        ) : (
          <div className="space-y-4">
            {fees?.map(fee => (
              <div key={fee.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 gap-4">
                <div>
                  <h4 className="font-bold text-lg">{fee.month}</h4>
                  <p className="text-muted-foreground text-sm font-mono mt-1">${fee.amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {fee.paid ? (
                    <Badge variant="success">Paid on {fee.paidDate ? format(new Date(fee.paidDate), "MMM dd, yyyy") : 'N/A'}</Badge>
                  ) : (
                    <Badge variant="danger">Unpaid</Badge>
                  )}
                  {!fee.paid && (
                    <Button variant="secondary" onClick={() => markPaid(fee.id)} className="ml-auto">
                      <CheckCircle className="w-4 h-4" /> Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Fee Record">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Month/Description</label>
            <Input value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} required placeholder="e.g. September 2024" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Amount ($)</label>
            <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} required />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input 
              type="checkbox" 
              id="paid" 
              checked={formData.paid} 
              onChange={e => setFormData({...formData, paid: e.target.checked})}
              className="w-4 h-4 rounded border-white/10 bg-black/20"
            />
            <label htmlFor="paid" className="text-sm">Already Paid?</label>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isAdding}>Add Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
