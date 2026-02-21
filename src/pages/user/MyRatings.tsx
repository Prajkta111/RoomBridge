import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Star } from "lucide-react";

const ratings = [
  { id: 1, from: "Priya S.", rating: 5, comment: "Very clean room, great person to deal with!", date: "Feb 15, 2026" },
  { id: 2, from: "Rahul K.", rating: 4, comment: "Good communication. Room was as described.", date: "Feb 10, 2026" },
  { id: 3, from: "Sneha M.", rating: 5, comment: "Highly recommend! Very trustworthy.", date: "Jan 28, 2026" },
];

const MyRatings = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Overall rating */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card text-center">
          <span className="font-display text-5xl font-bold text-foreground">4.8</span>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= 4 ? "text-secondary fill-secondary" : "text-secondary fill-secondary/30"}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Based on {ratings.length} reviews</p>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {ratings.map((r) => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {r.from.charAt(0)}
                  </div>
                  <span className="font-medium text-sm text-foreground">{r.from}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default MyRatings;
