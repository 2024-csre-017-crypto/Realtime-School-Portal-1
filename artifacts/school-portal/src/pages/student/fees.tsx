import { useGetMe, useGetStudentFees } from "@workspace/api-client-react";
import { Card, Badge } from "@/components/ui-elements";
import { CreditCard, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function StudentFees() {
  const { data: me } = useGetMe();
  const { data: fees, isLoading } = useGetStudentFees(me?.id || "", { query: { enabled: !!me?.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Fee Statements</h1>
        <p className="text-muted-foreground mt-1">View your payment history</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading fees...</p>
      ) : fees?.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No fee records available.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees?.map(fee => (
            <Card key={fee.id} className="p-6 border-l-4 border-l-transparent data-[paid=true]:border-l-emerald-500 data-[paid=false]:border-l-red-500" data-paid={fee.paid}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{fee.month}</h3>
                  <div className="text-3xl font-display font-black tracking-tight">${fee.amount.toFixed(2)}</div>
                </div>
                {fee.paid ? (
                  <div className="flex flex-col items-end text-emerald-400">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <Badge variant="success">Paid</Badge>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="w-8 h-8 mb-2"></div>
                    <Badge variant="danger">Unpaid</Badge>
                  </div>
                )}
              </div>
              
              {fee.paid && fee.paidDate && (
                <div className="mt-6 pt-4 border-t border-white/5 text-sm text-muted-foreground">
                  Paid on: <span className="text-white">{format(new Date(fee.paidDate), "MMMM dd, yyyy")}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
