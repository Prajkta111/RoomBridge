import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Users, Home, Flag, CheckSquare, Loader2, UserPlus, AlertTriangle } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    pendingReports: 0,
    pendingVerifications: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersDocs, listingsDocs, reportsDocs, verDocs, allReportsDocs] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(query(collection(db, "listings"), where("status", "==", "active"))),
          getDocs(query(collection(db, "reports"), where("status", "==", "pending"))),
          getDocs(query(collection(db, "verifications"), where("status", "==", "pending"))),
          getDocs(collection(db, "reports")),
        ]);

        setStats({
          totalUsers: usersDocs.size,
          activeListings: listingsDocs.size,
          pendingReports: reportsDocs.size,
          pendingVerifications: verDocs.size,
        });

        const sortByDate = (a: any, b: any) =>
          (b.created_at?.toMillis?.() ?? 0) - (a.created_at?.toMillis?.() ?? 0);

        setRecentUsers(
          usersDocs.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort(sortByDate)
            .slice(0, 5)
        );
        setRecentReports(
          allReportsDocs.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort(sortByDate)
            .slice(0, 5)
        );
      } catch (err) {
        console.error("AdminDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const timeAgo = (ts: any) => {
    if (!ts?.toDate) return "";
    const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, sub: "Registered accounts", color: "bg-primary", to: "/admin/users" },
    { icon: Home, label: "Active Listings", value: stats.activeListings, sub: "Live room listings", color: "bg-secondary", to: "/admin/listings" },
    { icon: Flag, label: "Pending Reports", value: stats.pendingReports, sub: "Awaiting review", color: "bg-destructive", to: "/admin/reports" },
    { icon: CheckSquare, label: "Pending Verifications", value: stats.pendingVerifications, sub: "ID submissions", color: "bg-primary", to: "/admin/verifications" },
  ];

  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Admin Overview</h2>
          <p className="text-muted-foreground text-sm">Platform health and activity at a glance.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <Link key={s.label} to={s.to} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                      <s.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                  </div>
                  <span className="font-display text-3xl font-bold text-foreground">{s.value}</span>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </Link>
              ))}
            </div>

            {/* Recent Activity: 2 columns */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">Recent Registrations</h3>
                  </div>
                  <Link to="/admin/users" className="text-xs text-primary hover:underline">See all</Link>
                </div>
                {recentUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentUsers.map((u) => (
                      <li key={u.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">{u.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{u.email || u.user_type || ""}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(u.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent Reports */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h3 className="font-semibold text-sm text-foreground">Recent Reports</h3>
                  </div>
                  <Link to="/admin/reports" className="text-xs text-primary hover:underline">See all</Link>
                </div>
                {recentReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No reports found</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentReports.map((r) => (
                      <li key={r.id} className="flex items-center justify-between px-4 py-3 gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground capitalize leading-tight truncate">
                            {r.report_type?.replace(/_/g, " ") || "Report"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{r.description || "No description"}</p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                            r.status === "pending" ? "bg-destructive/10 text-destructive" :
                            r.status === "resolved" ? "bg-primary/10 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>{r.status}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
