import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleRequests = [
  { id: 1, user: "Priya S.", need: "Need room near BITS Pilani", date: "Mar 5 - Mar 7", budget: "₹500/day", type: "Emergency", gender: "Female", posted: "2h ago" },
  { id: 2, user: "Rahul K.", need: "Looking for PG near Infosys campus", date: "Apr 1 onwards", budget: "₹7,000/mo", type: "Long-Term", gender: "Male", posted: "5h ago" },
  { id: 3, user: "Sneha M.", need: "Shared flat, Koramangala area", date: "Mar 15 onwards", budget: "₹5,500/mo", type: "Flatmate", gender: "Female", posted: "1d ago" },
];

const RoomRequests = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">People looking for rooms near you</p>
          <Button variant="action" size="sm">Post Your Request</Button>
        </div>

        <div className="space-y-4">
          {sampleRequests.map((req) => (
            <div key={req.id} className={`bg-card rounded-xl border p-5 shadow-card ${req.type === "Emergency" ? "border-secondary" : "border-border"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {req.user.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-foreground">{req.user}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      req.type === "Emergency" ? "bg-secondary/10 text-secondary" : "bg-accent text-accent-foreground"
                    }`}>
                      {req.type}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">{req.need}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{req.date}</span>
                    <span>Budget: {req.budget}</span>
                    <span>Gender: {req.gender}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-muted-foreground">{req.posted}</span>
                  <Button variant="brand-outline" size="sm">Respond</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default RoomRequests;
