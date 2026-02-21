import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, X, ShieldCheck, ShieldOff, User, Mail, Phone, MapPin, Building2, Star, Calendar } from "lucide-react";
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<any | null>(null);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("created_at", "desc"), limit(100));
        const snapshot = await getDocs(q);
        
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBan = async (u: any) => {
    const newBan = u.ban_status === "active" ? "none" : "active";
    setActioning(true);
    try {
      await updateDoc(doc(db, "users", u.id), {
        ban_status: newBan,
        updated_at: serverTimestamp(),
      });
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, ban_status: newBan } : x));
      if (selected?.id === u.id) setSelected((prev: any) => ({ ...prev, ban_status: newBan }));
      toast({ title: newBan === "active" ? "User banned" : "User unbanned" });
    } catch {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
    } finally {
      setActioning(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === "All") return true;
    if (filter === "Active") return user.ban_status === "none";
    if (filter === "Pending") return user.verification_status === "pending";
    if (filter === "Banned") return user.ban_status === "active";
    return true;
  });

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
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage all registered users</p>
          <div className="flex gap-2">
            {["All", "Active", "Pending", "Banned"].map((f) => (
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

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Verified</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{user.name}</span>
                            <span className="text-xs text-muted-foreground block">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.user_type || 'N/A'}</td>
                      <td className="p-4">
                        {user.verification_status === "verified" ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          user.ban_status === "none" ? "bg-primary/10 text-primary" :
                          user.verification_status === "pending" ? "bg-secondary/10 text-secondary" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {user.ban_status === "active" ? "Banned" : 
                           user.verification_status === "pending" ? "Pending" : "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.created_at?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(user)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-bold text-foreground text-base">User Details</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                {selected.selfie_url ? (
                  <img src={selected.selfie_url} alt={selected.name} className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xl font-bold flex-shrink-0">
                    {selected.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground text-lg leading-tight">{selected.name || "—"}</p>
                  <p className="text-sm text-muted-foreground capitalize">{selected.user_type || "—"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      selected.ban_status === "active" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>{selected.ban_status === "active" ? "Banned" : "Active"}</span>
                    {selected.verification_status === "verified" && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Verified</span>
                    )}
                    {selected.verification_status === "pending" && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Pending Verification</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={selected.email} />
                <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={selected.phone} />
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Age / Gender" value={selected.age ? `${selected.age} / ${selected.gender}` : selected.gender} />
                <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="City" value={selected.city} />
                <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Home District" value={selected.home_district} />
                <InfoRow icon={<Star className="w-3.5 h-3.5" />} label="Rating" value={selected.average_rating ? `${Number(selected.average_rating).toFixed(1)} (${selected.total_ratings} reviews)` : "No ratings"} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Joined" value={selected.created_at?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
              </div>

              {/* Student info */}
              {(selected.college || selected.course) && (
                <div className="bg-muted rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Student Info</p>
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="College" value={selected.college} />
                  <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Course" value={selected.course} />
                  {selected.year && <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Year" value={String(selected.year)} />}
                  {selected.student_id_url && (
                    <a href={selected.student_id_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View Student ID</a>
                  )}
                </div>
              )}

              {/* Professional info */}
              {(selected.company || selected.role) && (
                <div className="bg-muted rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Professional Info</p>
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Company" value={selected.company} />
                  <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Role" value={selected.role} />
                  {selected.professional_id_url && (
                    <a href={selected.professional_id_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View Professional ID</a>
                  )}
                </div>
              )}

              {/* Ban reason */}
              {selected.ban_status === "active" && selected.ban_reason && (
                <div className="bg-destructive/10 rounded-xl p-3 text-xs text-destructive">
                  <strong>Ban reason:</strong> {selected.ban_reason}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-5 pt-0 flex gap-2">
              <Button
                variant={selected.ban_status === "active" ? "outline" : "destructive"}
                size="sm"
                disabled={actioning}
                onClick={() => toggleBan(selected)}
                className="flex items-center gap-1.5"
              >
                {actioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                  selected.ban_status === "active"
                    ? <><ShieldCheck className="w-3.5 h-3.5" /> Unban User</>
                    : <><ShieldOff className="w-3.5 h-3.5" /> Ban User</>
                }
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) => (
  value ? (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm text-foreground font-medium break-all">{value}</p>
      </div>
    </div>
  ) : null
);

export default AdminUsers;
