import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  { id: 1, from: "Priya S.", to: "Rahul K.", rating: 5, comment: "Great room! Very clean and well-maintained.", date: "Feb 20, 2026", flagged: false },
  { id: 2, from: "Unknown", to: "Sneha M.", rating: 1, comment: "FAKE LISTING! DO NOT TRUST!", date: "Feb 19, 2026", flagged: true },
  { id: 3, from: "Amit D.", to: "Priya S.", rating: 4, comment: "Smooth transaction. Good communication.", date: "Feb 18, 2026", flagged: false },
];

const AdminReviews = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-sm text-muted-foreground">Monitor and moderate user reviews</p>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className={`bg-card rounded-xl border p-5 shadow-card ${r.flagged ? "border-destructive/40" : "border-border"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">
                  <span className="font-medium text-foreground">{r.from}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="font-medium text-foreground">{r.to}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{r.comment}</p>
              {r.flagged && (
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">Remove Review</Button>
                  <Button variant="ghost" size="sm">Dismiss Flag</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminReviews;
