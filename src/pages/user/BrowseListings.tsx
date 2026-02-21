import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Search, MapPin, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleListings = [
  { id: 1, title: "Spacious Room near IIT Gate", type: "Long-Term", price: "₹6,500/mo", rating: 4.8, location: "Powai, Mumbai", verified: true, match: "Same College" },
  { id: 2, title: "PG with Meals - Girls Only", type: "PG", price: "₹8,000/mo", rating: 4.5, location: "Koramangala, Bangalore", verified: true, match: "Best Match" },
  { id: 3, title: "Emergency Stay - 3 Days", type: "Emergency", price: "₹500/day", rating: 4.2, location: "Kota, Rajasthan", verified: true, match: "Emergency", emergency: true },
  { id: 4, title: "Shared Flat near Tech Park", type: "Flatmate", price: "₹5,500/mo", rating: 4.6, location: "Hinjewadi, Pune", verified: true, match: "Same Hometown" },
  { id: 5, title: "Furnished 1BHK for Interns", type: "Short Stay", price: "₹9,000/mo", rating: 4.7, location: "Gurgaon, Delhi", verified: false, match: null },
  { id: 6, title: "Budget Room - Students Only", type: "Long-Term", price: "₹3,500/mo", rating: 4.0, location: "Anna Nagar, Chennai", verified: true, match: "Same College" },
];

const BrowseListings = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by location, college, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="action" size="default">Search</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["All", "Long-Term", "PG", "Short Stay", "Emergency", "Flatmate"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === "All"
                    ? "bg-primary text-primary-foreground"
                    : filter === "Emergency"
                    ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleListings.map((listing) => (
            <div
              key={listing.id}
              className={`bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 ${
                listing.emergency ? "border-secondary" : "border-border"
              }`}
            >
              {/* Image Placeholder */}
              <div className="h-36 bg-muted relative">
                <span className="absolute bottom-2 left-2 text-xs font-semibold bg-background/90 text-foreground px-2 py-1 rounded">
                  {listing.type}
                </span>
                {listing.emergency && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold bg-secondary text-primary-foreground px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent
                  </span>
                )}
                {listing.match && !listing.emergency && (
                  <span className="absolute top-2 right-2 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded">
                    {listing.match}
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-bold text-foreground text-sm mb-1 truncate">{listing.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                  <MapPin className="w-3 h-3" />
                  {listing.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-lg">{listing.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                    <span className="text-xs font-medium text-foreground">{listing.rating}</span>
                  </div>
                </div>
                {listing.verified && (
                  <div className="flex gap-1.5 mt-3">
                    <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded font-medium">✔ Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default BrowseListings;
