import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Shield } from "lucide-react";

const users = [
  { id: 1, name: "Priya Sharma", email: "priya@iitd.ac.in", type: "Student", college: "IIT Delhi", verified: true, status: "Active", joined: "Feb 1, 2026" },
  { id: 2, name: "Rahul Kumar", email: "rahul@gmail.com", type: "Professional", company: "Infosys", verified: true, status: "Active", joined: "Jan 25, 2026" },
  { id: 3, name: "Sneha M.", email: "sneha@bits.ac.in", type: "Student", college: "BITS Pilani", verified: false, status: "Pending", joined: "Feb 18, 2026" },
  { id: 4, name: "Vikram Broker", email: "vikram@mail.com", type: "Unknown", college: "-", verified: false, status: "Banned", joined: "Feb 5, 2026" },
  { id: 5, name: "Amit Desai", email: "amit@pune.com", type: "Student", college: "MIT Pune", verified: true, status: "Active", joined: "Feb 10, 2026" },
];

const AdminUsers = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage all registered users</p>
          <div className="flex gap-2">
            {["All", "Active", "Pending", "Banned"].map((f) => (
              <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                f === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Verified</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">{user.name.charAt(0)}</div>
                        <div>
                          <span className="font-medium text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground block">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.type}</td>
                    <td className="p-4">
                      {user.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.status === "Active" ? "bg-primary/10 text-primary" :
                        user.status === "Pending" ? "bg-secondary/10 text-secondary" :
                        "bg-destructive/10 text-destructive"
                      }`}>{user.status}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.joined}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminUsers;
