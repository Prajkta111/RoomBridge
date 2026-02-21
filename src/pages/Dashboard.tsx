import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Search, Home, MessageCircle, Star } from "lucide-react";

const stats = [
  { icon: Search, label: "Active Listings", value: "12", color: "bg-primary" },
  { icon: Home, label: "Room Requests", value: "5", color: "bg-secondary" },
  { icon: MessageCircle, label: "Messages", value: "23", color: "bg-primary" },
  { icon: Star, label: "Your Rating", value: "4.8", color: "bg-secondary" },
];

const Dashboard = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome back! 👋</h2>
          <p className="text-muted-foreground text-sm">Here's what's happening with your account.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">🔥 Your Top Matches</h3>
          <div className="text-center py-12 text-muted-foreground text-sm">
            Complete your profile to see personalized room matches.
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default Dashboard;
