import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Clock, Loader2, MapPin, IndianRupee } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "fulfilled">("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [reqDocs, userDocs] = await Promise.all([
          getDocs(collection(db, "room_requests")),
          getDocs(collection(db, "users")),
        ]);

        const userMap: Record<string, string> = {};
        userDocs.docs.forEach((d) => {
          const data = d.data();
          userMap[d.id] = data.name || data.email || d.id;
        });

        const list = reqDocs.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (b.created_at?.toMillis?.() ?? 0) - (a.created_at?.toMillis?.() ?? 0))
          .map((r: any) => ({ ...r, userName: userMap[r.searcher_id] || "Unknown" }));

        setRequests(list);
      } catch (err) {
        console.error("AdminRequests fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const filtered = filter === "all" ? requests : requests.filter((r: any) => r.status === filter);

  const statusColor = (s: string) => {
    if (s === "active") return "text-primary bg-primary/10";
    if (s === "fulfilled") return "text-green-600 bg-green-100";
    if (s === "expired") return "text-muted-foreground bg-muted";
    return "text-muted-foreground bg-muted";
  };

  const typeColor = (t: string) =>
    t === "emergency" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">Manage room requests from users</p>
          <div className="flex gap-2 text-xs">
            {(["all", "active", "expired", "fulfilled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full capitalize font-medium border transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground text-sm shadow-card">
            No requests found.
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Request</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((req: any) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground whitespace-nowrap">{req.userName}</td>
                    <td className="p-4 max-w-xs">
                      <p className="text-foreground font-medium leading-tight truncate">{req.title || "—"}</p>
                      {req.needed_from && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(req.needed_from)}{req.needed_until ? ` – ${formatDate(req.needed_until)}` : ""}
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${typeColor(req.request_type)}`}>
                        {req.request_type || "normal"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {req.budget_min || req.budget_max ? (
                        <span className="flex items-center gap-0.5">
                          <IndianRupee className="w-3 h-3" />
                          {req.budget_min ?? "?"} – {req.budget_max ?? "?"}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColor(req.status)}`}>
                        {req.status || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {req.city ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {req.city}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap text-xs">
                      {formatDate(req.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminRequests;
