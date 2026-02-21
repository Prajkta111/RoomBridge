import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, X, ChevronLeft, ChevronRight, IndianRupee, Calendar, Home, User, Tag, Trash2 } from "lucide-react";
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const AdminListings = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<any | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("created_at", "desc"), limit(50));
        const snapshot = await getDocs(q);
        
        const listingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    if (filter === "All") return true;
    if (filter === "Active") return listing.status === "active";
    if (filter === "Flagged") return listing.status === "flagged";
    if (filter === "Removed") return listing.status === "deleted";
    return true;
  });

  const removeListing = async (listing: any) => {
    setActioning(true);
    try {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "deleted",
        deleted_at: serverTimestamp(),
      });
      setListings((prev) => prev.map((l) => l.id === listing.id ? { ...l, status: "deleted" } : l));
      if (selected?.id === listing.id) setSelected((p: any) => ({ ...p, status: "deleted" }));
      toast({ title: "Listing removed", description: "The listing has been deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to remove listing.", variant: "destructive" });
    } finally {
      setActioning(false);
    }
  };

  const formatDate = (ts: any) =>
    ts?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) || "—";

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <>
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Review and manage all listings</p>
          <div className="flex gap-2">
            {["All", "Active", "Flagged", "Removed"].map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  f === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredListings.map((listing) => (
              <div key={listing.id} className={`bg-card rounded-xl border p-5 shadow-card ${
                listing.status === "flagged" ? "border-destructive/40" : "border-border"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">{listing.title}</h3>
                    <p className="text-xs text-muted-foreground">by {listing.poster_id}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    listing.status === "active" ? "bg-primary/10 text-primary" :
                    "bg-destructive/10 text-destructive"
                  }`}>{listing.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.city}</span>
                  <span>{listing.listing_type}</span>
                  <span className="font-semibold text-foreground">₹{listing.rent_amount}/mo</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(listing); setImgIdx(0); }}>View</Button>
                  {listing.status === "flagged" && <Button variant="destructive" size="sm" onClick={() => removeListing(listing)}>Remove</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>

    {/* Listing Detail Modal */}
    {selected && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
        <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-display font-bold text-foreground text-base">Listing Details</h3>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Image gallery */}
            {selected.images?.length > 0 ? (
              <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
                <img
                  src={selected.images[imgIdx]}
                  alt={`Image ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                {selected.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + selected.images.length) % selected.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % selected.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {selected.images.map((_: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                    <span className="absolute top-2 right-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">
                      {imgIdx + 1} / {selected.images.length}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                No images uploaded
              </div>
            )}

            {/* Title + status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display font-bold text-foreground text-lg leading-tight">{selected.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Posted by: {selected.poster_id}</p>
              </div>
              <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                selected.status === "active" ? "bg-primary/10 text-primary" :
                selected.status === "deleted" ? "bg-destructive/10 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>{selected.status}</span>
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-2 gap-3">
              <DetailRow icon={<IndianRupee className="w-3.5 h-3.5" />} label="Rent" value={selected.rent_amount ? `₹${selected.rent_amount?.toLocaleString("en-IN")}/mo` : undefined} />
              <DetailRow icon={<IndianRupee className="w-3.5 h-3.5" />} label="Deposit" value={selected.deposit_amount ? `₹${selected.deposit_amount?.toLocaleString("en-IN")}` : undefined} />
              <DetailRow icon={<MapPin className="w-3.5 h-3.5" />} label="City" value={selected.city} />
              <DetailRow icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={selected.location} />
              <DetailRow icon={<Home className="w-3.5 h-3.5" />} label="Type" value={selected.listing_type?.replace(/_/g, " ")} />
              <DetailRow icon={<Home className="w-3.5 h-3.5" />} label="Room" value={selected.room_type?.toUpperCase()} />
              <DetailRow icon={<User className="w-3.5 h-3.5" />} label="Gender Pref" value={selected.preferences?.gender_preference} />
              <DetailRow icon={<Tag className="w-3.5 h-3.5" />} label="Furnishing" value={selected.preferences?.furnishing?.replace(/-/g, " ")} />
              <DetailRow icon={<Calendar className="w-3.5 h-3.5" />} label="Available From" value={formatDate(selected.available_from)} />
              <DetailRow icon={<Calendar className="w-3.5 h-3.5" />} label="Posted On" value={formatDate(selected.created_at)} />
            </div>

            {/* Amenities */}
            {selected.amenities?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.amenities.map((a: string) => (
                    <span key={a} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full capitalize">{a.replace(/_/g, " ")}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selected.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="p-5 pt-0 flex gap-2 flex-wrap">
            {selected.status !== "deleted" && (
              <Button
                variant="destructive"
                size="sm"
                disabled={actioning}
                onClick={() => removeListing(selected)}
                className="flex items-center gap-1.5"
              >
                {actioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5" /> Remove Listing</>}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) =>
  value ? (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm text-foreground font-medium capitalize">{value}</p>
      </div>
    </div>
  ) : null;

export default AdminListings;

