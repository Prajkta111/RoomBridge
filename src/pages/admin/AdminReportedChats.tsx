import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertTriangle } from "lucide-react";

const reportedChats = [
  { id: 1, reporter: "Priya S.", reported: "Unknown User", reason: "Harassment", snippet: "Inappropriate messages...", time: "1h ago", severity: "High" },
  { id: 2, reporter: "Rahul K.", reported: "Vikram B.", reason: "Broker activity", snippet: "Asking for broker fee of ₹5000...", time: "3h ago", severity: "Medium" },
  { id: 3, reporter: "Sneha M.", reported: "Amit D.", reason: "Misleading info", snippet: "Room photos don't match reality...", time: "1d ago", severity: "Low" },
];

const AdminReportedChats = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-sm text-muted-foreground">Review reported chat conversations</p>

        <div className="space-y-4">
          {reportedChats.map((chat) => (
            <div key={chat.id} className={`bg-card rounded-xl border p-5 shadow-card ${
              chat.severity === "High" ? "border-destructive/40" : "border-border"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{chat.reporter}</span>
                  <span className="text-xs text-muted-foreground">reported</span>
                  <span className="text-sm font-medium text-foreground">{chat.reported}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  chat.severity === "High" ? "bg-destructive/10 text-destructive" :
                  chat.severity === "Medium" ? "bg-secondary/10 text-secondary" :
                  "bg-muted text-muted-foreground"
                }`}>{chat.severity}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <AlertTriangle className="w-3 h-3" />
                <span>Reason: {chat.reason}</span>
                <span>• {chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 mb-3 italic">"{chat.snippet}"</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View Full Chat</Button>
                <Button variant="destructive" size="sm">Ban User</Button>
                <Button variant="brand-outline" size="sm">Dismiss</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminReportedChats;
