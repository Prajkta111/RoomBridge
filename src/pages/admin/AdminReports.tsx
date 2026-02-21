import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Flag, AlertTriangle } from "lucide-react";

const reports = [
  { id: 1, type: "Fake Identity", user: "Vikram B.", reporter: "System Auto", detail: "Multiple identity mismatches detected", status: "Open", severity: "High" },
  { id: 2, type: "Broker", user: "Raj Agents", reporter: "Priya S.", detail: "Charging commission fee, posing as owner", status: "Open", severity: "High" },
  { id: 3, type: "Scam", user: "Unknown123", reporter: "Rahul K.", detail: "Asking advance payment before showing room", status: "Under Review", severity: "Medium" },
  { id: 4, type: "Misleading Profile", user: "Sneha M.", reporter: "Amit D.", detail: "Profile photo doesn't match real person", status: "Resolved", severity: "Low" },
];

const AdminReports = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">User reports and trust flags</p>
          <div className="flex gap-2">
            {["All", "Open", "Under Review", "Resolved"].map((f) => (
              <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                f === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className={`bg-card rounded-xl border p-5 shadow-card ${
              r.severity === "High" ? "border-destructive/40" : "border-border"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flag className={`w-4 h-4 ${r.severity === "High" ? "text-destructive" : r.severity === "Medium" ? "text-secondary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.type}</span>
                  <span className="text-sm font-medium text-foreground">against {r.user}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  r.status === "Open" ? "bg-destructive/10 text-destructive" :
                  r.status === "Under Review" ? "bg-secondary/10 text-secondary" :
                  "bg-primary/10 text-primary"
                }`}>{r.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{r.detail}</p>
              <p className="text-xs text-muted-foreground mb-3">Reported by: {r.reporter}</p>
              {r.status !== "Resolved" && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Investigate</Button>
                  <Button variant="destructive" size="sm">Ban User</Button>
                  <Button variant="brand-outline" size="sm">Dismiss</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminReports;
