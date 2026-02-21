import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Eye } from "lucide-react";

const verifications = [
  { id: 1, user: "Priya S.", docType: "Aadhaar Card", submitted: "Feb 20, 2026", status: "Pending" },
  { id: 2, user: "Rahul K.", docType: "PAN Card", submitted: "Feb 19, 2026", status: "Approved" },
  { id: 3, user: "Sneha M.", docType: "Student ID", submitted: "Feb 18, 2026", status: "Pending" },
  { id: 4, user: "Amit D.", docType: "Company ID", submitted: "Feb 17, 2026", status: "Rejected" },
  { id: 5, user: "Kavya R.", docType: "Live Selfie", submitted: "Feb 21, 2026", status: "Pending" },
];

const AdminVerifications = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Review identity verification documents</p>
          <span className="text-xs font-semibold bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">3 Pending</span>
        </div>

        <div className="space-y-3">
          {verifications.map((v) => (
            <div key={v.id} className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="font-medium text-sm text-foreground">{v.user}</span>
                  <span className="text-xs text-muted-foreground block">{v.docType} • Submitted {v.submitted}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  v.status === "Approved" ? "bg-primary/10 text-primary" :
                  v.status === "Rejected" ? "bg-destructive/10 text-destructive" :
                  "bg-secondary/10 text-secondary"
                }`}>{v.status}</span>
                {v.status === "Pending" && (
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-primary"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive"><XCircle className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminVerifications;
