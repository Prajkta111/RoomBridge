import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Users, Home, Flag, CheckSquare } from "lucide-react";

const adminStats = [
  { icon: Users, label: "Total Users", value: "1,247", change: "+32 this week", color: "bg-primary" },
  { icon: Home, label: "Active Listings", value: "856", change: "+18 this week", color: "bg-secondary" },
  { icon: Flag, label: "Pending Reports", value: "12", change: "3 urgent", color: "bg-destructive" },
  { icon: CheckSquare, label: "Pending Verifications", value: "45", change: "8 today", color: "bg-primary" },
];

const recentActivity = [
  { action: "New user registered", detail: "Priya Sharma — IIT Delhi", time: "5m ago", type: "user" },
  { action: "Listing reported", detail: "Fake photos in listing #2341", time: "12m ago", type: "report" },
  { action: "Verification submitted", detail: "Rahul Kumar — Aadhaar upload", time: "25m ago", type: "verify" },
  { action: "User banned", detail: "Broker account detected — ID #892", time: "1h ago", type: "ban" },
  { action: "New listing posted", detail: "2BHK near Hinjewadi Tech Park", time: "2h ago", type: "listing" },
];

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Admin Overview</h2>
          <p className="text-muted-foreground text-sm">Platform health and activity at a glance.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-5 border-b border-border">
            <h3 className="font-display text-lg font-bold text-foreground">Recent Activity</h3>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">{item.action}</span>
                  <span className="text-xs text-muted-foreground block">{item.detail}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
