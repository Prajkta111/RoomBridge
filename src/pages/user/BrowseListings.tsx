import { useState, useEffect } from "react";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Search, MapPin, AlertTriangle, Loader2, Home, MessageCircle, ChevronLeft, ChevronRight, Calendar, IndianRupee, BedDouble, Users, Sofa, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ListingDocument } from "@/lib/firebase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createChatSession } from "@/lib/firebase/chats";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProfileModal } from "@/components/UserProfileModal";
import { matchListingScore } from "@/lib/matchScore";

const BrowseListings = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortByMatch, setSortByMatch] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingDocument | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [contactingOwner, setContactingOwner] = useState(false);
  const [profileOwnerId, setProfileOwnerId] = useState<string | null>(null);

  const handleContactOwner = async (posterId: string) => {
    if (!user) return;
    if (user.uid === posterId) {
      toast({ title: "That's your own listing!", variant: "destructive" });
      return;
    }
    setContactingOwner(true);
    try {
      const chat = await createChatSession(user.uid, posterId);
      navigate(`/dashboard/messages?chat=${chat.chat_id}`);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not open chat. Try again.", variant: "destructive" });
    } finally {
      setContactingOwner(false);
    }
  };

  useEffect(() => {
    // Real-time listener for active listings (simplified query while index builds)
    const listingsQuery = query(
      collection(db, "listings"),
      where("status", "==", "active"),
      limit(50)
    );

    const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
      const listingsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        listing_id: doc.id,
      })) as ListingDocument[];
      
      // Filter out user's own listings and sort in memory
      const othersListings = listingsData
        .filter(listing => listing.poster_id !== user?.uid)
        .sort((a, b) => {
          const aTime = a.created_at?.toMillis?.() || 0;
          const bTime = b.created_at?.toMillis?.() || 0;
          return bTime - aTime;
        });
      setListings(othersListings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Long-Term" && listing.listing_type === "long_term") ||
      (selectedFilter === "PG" && listing.listing_type === "pg") ||
      (selectedFilter === "Short Stay" && listing.listing_type === "short_stay") ||
      (selectedFilter === "Emergency" && listing.listing_type === "emergency") ||
      (selectedFilter === "Flatmate" && listing.listing_type === "flatmate");

    return matchesSearch && matchesFilter;
  });

  const getListingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      long_term: "Long-Term",
      pg: "PG",
      short_stay: "Short Stay",
      emergency: "Emergency",
      flatmate: "Flatmate",
    };
    return labels[type] || type;
  };

  const getMatchBadgeClass = (color: string) => {
    if (color === "green") return "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
    if (color === "yellow") return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20";
    if (color === "orange") return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20";
    return "bg-muted text-muted-foreground border border-border";
  };

  let displayListings = filteredListings;
  if (sortByMatch && userData) {
    displayListings = [...filteredListings].sort((a, b) => {
      const sa = matchListingScore(userData, a).score;
      const sb = matchListingScore(userData, b).score;
      return sb - sa;
    });
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="action" size="default">Search</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["All", "Long-Term", "PG", "Short Stay", "Emergency", "Flatmate"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === selectedFilter
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {displayListings.length} listing{displayListings.length !== 1 ? "s" : ""} found
            {sortByMatch && userData ? " · sorted by match" : ""}
          </p>
          {userData && (
            <button
              onClick={() => setSortByMatch((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                sortByMatch
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              <Zap className="w-3 h-3" />
              {sortByMatch ? "Sorted by Match" : "Sort by Match"}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && displayListings.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayListings.map((listing) => {
              const isEmergency = listing.listing_type === "emergency";
              const match = userData ? matchListingScore(userData, listing) : null;
              return (
                <div
                  key={listing.listing_id}
                  onClick={() => { setSelectedListing(listing); setImageIndex(0); }}
                  className={`bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 cursor-pointer ${
                    isEmergency ? "border-secondary" : "border-border"
                  }`}
                >
                  {/* Image */}
                  <div className="h-36 bg-muted relative">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Home className="w-12 h-12" />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 text-xs font-semibold bg-background/90 text-foreground px-2 py-1 rounded">
                      {getListingTypeLabel(listing.listing_type)}
                    </span>
                    {isEmergency && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold bg-secondary text-primary-foreground px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground text-sm mb-1 truncate">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {listing.location}, {listing.city}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-primary text-lg">
                        ₹{listing.rent_amount.toLocaleString()}/mo
                      </span>
                    </div>
                    {listing.amenities && listing.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {listing.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Match badge */}
                    {match && (
                      <div className={`mt-3 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${getMatchBadgeClass(match.color)}`}>
                        <Zap className="w-3 h-3" />
                        <span>{match.score}% {match.label} Match</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Listing Details Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
          {selectedListing && (() => {
            const l = selectedListing;
            const images = l.images || [];
            const isEmergency = l.listing_type === "emergency";
            return (
              <>
                {/* Image Carousel */}
                <div className="relative h-56 bg-muted">
                  {images.length > 0 ? (
                    <img
                      src={images[imageIndex]}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Home className="w-16 h-16" />
                    </div>
                  )}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              i === imageIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {isEmergency && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 text-xs font-bold bg-secondary text-primary-foreground px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      Urgent
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-xs font-semibold bg-background/90 text-foreground px-2 py-1 rounded">
                    {getListingTypeLabel(l.listing_type)}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-5">
                  <DialogHeader>
                    <DialogTitle className="text-xl leading-snug">{l.title}</DialogTitle>
                  </DialogHeader>

                  {/* Location + Posted date */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{l.location}, {l.city}</span>
                    </div>
                    {l.created_at && (
                      <span className="text-xs text-muted-foreground">
                        Posted {(() => {
                          const date = l.created_at?.toDate ? l.created_at.toDate() : new Date(l.created_at);
                          const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
                          return diff === 0 ? "today" : diff === 1 ? "yesterday" : `${diff} days ago`;
                        })()}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                      <p className="font-display font-bold text-primary text-xl">₹{l.rent_amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Security Deposit</p>
                      <p className="font-display font-bold text-foreground text-xl">₹{l.deposit_amount?.toLocaleString() || "—"}</p>
                    </div>
                  </div>

                  {/* Synergy Match Score */}
                  {(() => {
                    const m = userData ? matchListingScore(userData, l) : null;
                    if (!m) return null;
                    const barColor = m.color === "green" ? "bg-green-500" : m.color === "yellow" ? "bg-yellow-500" : m.color === "orange" ? "bg-orange-500" : "bg-muted-foreground";
                    const bgClass = m.color === "green" ? "bg-green-500/5 border-green-500/20" : m.color === "yellow" ? "bg-yellow-500/5 border-yellow-500/20" : m.color === "orange" ? "bg-orange-500/5 border-orange-500/20" : "bg-muted border-border";
                    return (
                      <div className={`border rounded-xl p-4 ${bgClass}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-foreground">Synergy Match</span>
                          </div>
                          <span className="text-2xl font-display font-bold text-foreground">{m.score}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted mb-3">
                          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${m.score}%` }} />
                        </div>
                        {m.details.length > 0 && (
                          <ul className="space-y-0.5">
                            {m.details.map((d, i) => (
                              <li key={i} className="text-xs text-muted-foreground">{d}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-muted/60 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Listing Type</p>
                      <p className="text-sm font-semibold text-foreground">{getListingTypeLabel(l.listing_type)}</p>
                    </div>
                    {l.room_type && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Room Type</p>
                        <p className="text-sm font-semibold text-foreground">{l.room_type?.toUpperCase()}</p>
                      </div>
                    )}
                    {l.preferences?.furnishing && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Furnishing</p>
                        <p className="text-sm font-semibold text-foreground capitalize">{l.preferences.furnishing}</p>
                      </div>
                    )}
                    {l.preferences?.gender_preference && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Preferred Tenant</p>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {l.preferences.gender_preference === "any" ? "Any Gender" : `${l.preferences.gender_preference} only`}
                        </p>
                      </div>
                    )}
                    <div className="bg-muted/60 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Available From</p>
                      <p className="text-sm font-semibold text-foreground">
                        {l.available_from
                          ? (l.available_from?.toDate ? l.available_from.toDate() : new Date(l.available_from as any))
                              .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Immediately"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {l.description && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">About this room</p>
                      <p className="text-sm text-foreground leading-relaxed">{l.description}</p>
                    </div>
                  )}

                  {/* Amenities */}
                  {l.amenities && l.amenities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {l.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Requirements */}
                  {l.preferences?.other_requirements && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Owner's Requirements</p>
                      <p className="text-sm text-foreground">{l.preferences.other_requirements}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="action"
                      size="sm"
                      className="flex-1"
                      disabled={contactingOwner}
                      onClick={() => handleContactOwner(selectedListing!.poster_id)}
                    >
                      {contactingOwner ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4 mr-1" />
                      )}
                      Contact Owner
                    </Button>
                    <Button
                      variant="brand-outline"
                      size="sm"
                      onClick={() => { setSelectedListing(null); setProfileOwnerId(selectedListing!.poster_id); }}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      View Profile & Rate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedListing(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Owner Profile & Rating Modal */}
      <UserProfileModal
        userId={profileOwnerId}
        open={!!profileOwnerId}
        onOpenChange={(open) => !open && setProfileOwnerId(null)}
      />
    </UserDashboardLayout>
  );
};

export default BrowseListings;
