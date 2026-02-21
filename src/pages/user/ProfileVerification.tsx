import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Camera } from "lucide-react";

const ProfileVerification = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Verification Status */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Verification Status</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Student Verified", status: "verified" },
              { label: "ID Verified", status: "verified" },
              { label: "Live Photo Verified", status: "pending" },
              { label: "Professional Verified", status: "not_started" },
            ].map((v) => (
              <div key={v.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                {v.status === "verified" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                ) : v.status === "pending" ? (
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <span className="text-sm font-medium text-foreground">{v.label}</span>
                  <span className={`block text-[10px] font-semibold ${
                    v.status === "verified" ? "text-primary" : v.status === "pending" ? "text-secondary" : "text-muted-foreground"
                  }`}>
                    {v.status === "verified" ? "✔ Completed" : v.status === "pending" ? "⏳ Under Review" : "Not Started"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
          <h2 className="font-display text-xl font-bold text-foreground">Profile Information</h2>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-2xl font-bold">U</div>
            <Button variant="brand-outline" size="sm">
              <Camera className="w-4 h-4 mr-1" /> Change Photo
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input type="text" defaultValue="User Name" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Age</label>
              <input type="number" defaultValue="21" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Gender</label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
              <input type="tel" defaultValue="+91 9876543210" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">College Name</label>
              <input type="text" defaultValue="IIT Bombay" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Course</label>
              <input type="text" defaultValue="B.Tech CSE" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Current City</label>
              <input type="text" defaultValue="Mumbai" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Home Village / District</label>
              <input type="text" defaultValue="Jaipur" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <Button variant="action" size="lg" className="w-full">Save Profile</Button>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default ProfileVerification;
