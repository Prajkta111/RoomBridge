import { useState, useEffect } from "react";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Loader2, Trash2, Edit, Eye, EyeOff, MapPin, AlertTriangle, Home, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Listing {
  listing_id: string;
  title: string;
  description: string;
  listing_type: string;
  room_type?: string;
  rent_amount: number;
  deposit_amount: number;
  location: string;
  city: string;
  status: string;
  images: string[];
  amenities?: string[];
  available_from?: any;
  created_at: any;
  updated_at?: any;
  preferences?: {
    gender_preference?: string;
    furnishing?: string;
    other_requirements?: string;
  };
}

const MyListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

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

  useEffect(() => {
    if (!user) return;

    const listingsQuery = query(
      collection(db, "listings"),
      where("poster_id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
      const listingsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        listing_id: doc.id,
      })) as Listing[];

      setListings(listingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async () => {
    if (!listingToDelete) return;

    try {
      await deleteDoc(doc(db, "listings", listingToDelete));
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await updateDoc(doc(db, "listings", listingId), {
        status: newStatus,
        updated_at: new Date(),
      });
      toast({
        title: "Success",
        description: `Listing ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update listing status",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage your room listings</p>
          <Button variant="action" size="sm" onClick={() => navigate("/dashboard/post")}>
            Post New Listing
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't posted any listings yet.</p>
            <Button variant="action" onClick={() => navigate("/dashboard/post")}>
              Post Your First Listing
            </Button>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.listing_id}
                className={`bg-card rounded-xl border p-5 shadow-card ${
                  listing.status === "inactive" ? "opacity-60" : ""
                }`}
              >
                <div className="flex gap-4">
                  {listing.images && listing.images.length > 0 && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-foreground mb-1">{listing.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className={`px-2 py-0.5 rounded-full ${
                            listing.status === "active" 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-gray-500/10 text-gray-600"
                          }`}>
                            {listing.status === "active" ? "Active" : "Inactive"}
                          </span>
                          <span>{listing.room_type?.toUpperCase()}</span>
                          <span>•</span>
                          <span>{listing.location}, {listing.city}</span>
                          <span>•</span>
                          <span>{getTimeAgo(listing.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">₹{listing.rent_amount.toLocaleString()}/mo</span>
                        <span className="text-muted-foreground ml-2">• Deposit: ₹{listing.deposit_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedListing(listing); setImageIndex(0); }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(listing.listing_id, listing.status)}
                        >
                          {listing.status === "active" ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/post?edit=${listing.listing_id}`)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setListingToDelete(listing.listing_id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
          {selectedListing && (() => {
            const l = selectedListing;
            const images = l.images || [];
            const isEmergency = l.listing_type === "emergency";
            return (
              <>
                {/* Image Carousel */}
                <div className="relative h-56 bg-muted rounded-t-xl overflow-hidden">
                  {images.length > 0 ? (
                    <img src={images[imageIndex]} alt={l.title} className="w-full h-full object-cover" />
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
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imageIndex ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
                    l.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}>
                    {l.status === "active" ? "Active" : "Inactive"}
                  </span>
                  {isEmergency && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold bg-secondary text-primary-foreground px-2 py-1 rounded">
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

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-muted/60 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Listing Type</p>
                      <p className="text-sm font-semibold text-foreground">{getListingTypeLabel(l.listing_type)}</p>
                    </div>
                    {l.room_type && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Room Type</p>
                        <p className="text-sm font-semibold text-foreground">{l.room_type.toUpperCase()}</p>
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
                          ? (l.available_from?.toDate ? l.available_from.toDate() : new Date(l.available_from))
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
                          <span key={amenity} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium">
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
                      onClick={() => {
                        setSelectedListing(null);
                        navigate(`/dashboard/post?edit=${l.listing_id}`);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit Listing
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
    </UserDashboardLayout>
  );
};

export default MyListings;
