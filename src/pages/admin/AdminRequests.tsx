import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const requests = [
  { id: 1, user: "Priya S.", need: "Need room near BITS Pilani", date: "Mar 5 - Mar 7", budget: "₹500/day", type: "Emergency", status: "Active", posted: "2h ago" },
  { id: 2, user: "Rahul K.", need: "Looking for PG near Infosys", date: "Apr 1 onwards", budget: "₹7,000/mo", type: "Long-Term", status: "Active", posted: "5h ago" },
  { id: 3, user: "Sneha M.", need: "Shared flat Koramangala", date: "Mar 15 onwards", budget: "₹5,500/mo", type: "Flatmate", status: "Expired", posted: "4d ago" },
];

const AdminRequests = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <p className="text-sm text-muted-foreground">Manage room requests from users</p>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Request</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Budget</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{req.user}</td>
                  <td className="p-4">
                    <span className="text-foreground">{req.need}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><Clock className="w-3 h-3" />{req.date}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      req.type === "Emergency" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                    }`}>{req.type}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{req.budget}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${req.status === "Active" ? "text-primary" : "text-muted-foreground"}`}>{req.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminRequests;
