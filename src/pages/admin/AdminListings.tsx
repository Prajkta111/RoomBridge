import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle } from "lucide-react";

const listings = [
  { id: 1, title: "Spacious Room near IIT Gate", poster: "Priya S.", location: "Powai, Mumbai", type: "Long-Term", price: "₹6,500/mo", status: "Active", reports: 0 },
  { id: 2, title: "PG with Meals - Girls Only", poster: "Rahul K.", location: "Koramangala, Bangalore", type: "PG", price: "₹8,000/mo", status: "Active", reports: 0 },
  { id: 3, title: "Suspicious Listing - Low Rent", poster: "Unknown", location: "Delhi", type: "Long-Term", price: "₹500/mo", status: "Flagged", reports: 3 },
  { id: 4, title: "Emergency Stay - Kota", poster: "Sneha M.", location: "Kota, Rajasthan", type: "Emergency", price: "₹500/day", status: "Active", reports: 0 },
];

const AdminListings = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Review and manage all listings</p>
          <div className="flex gap-2">
            {["All", "Active", "Flagged", "Removed"].map((f) => (
              <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                f === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className={`bg-card rounded-xl border p-5 shadow-card ${
              listing.status === "Flagged" ? "border-destructive/40" : "border-border"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm">{listing.title}</h3>
                  <p className="text-xs text-muted-foreground">by {listing.poster}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  listing.status === "Active" ? "bg-primary/10 text-primary" :
                  "bg-destructive/10 text-destructive"
                }`}>{listing.status}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location}</span>
                <span>{listing.type}</span>
                <span className="font-semibold text-foreground">{listing.price}</span>
              </div>
              {listing.reports > 0 && (
                <div className="flex items-center gap-1 text-xs text-destructive mb-3">
                  <AlertTriangle className="w-3 h-3" /> {listing.reports} reports
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                {listing.status === "Flagged" && <Button variant="destructive" size="sm">Remove</Button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminListings;
