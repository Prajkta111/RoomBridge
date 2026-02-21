import { useState, useEffect } from "react";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Clock, MapPin, Loader2, MessageCircle, AlertTriangle, User, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserDocument } from "@/lib/firebase/types";
import { getUser } from "@/lib/firebase/users";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createChatSession } from "@/lib/firebase/chats";
import { useToast } from "@/hooks/use-toast";
import { UserProfileModal } from "@/components/UserProfileModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { matchRequestScore } from "@/lib/matchScore";

// Extended type that matches what's actually stored in Firestore
interface RoomRequest {
  request_id: string;
  searcher_id: string;
  title: string;
  description?: string;
  request_type: string;
  duration?: string;
  location?: string;
  city: string;
  budget_min: number;
  budget_max: number;
  status: string;
  created_at: any;
  needed_from?: any;
  preferences?: {
    gender_preference?: string;
    location_preference?: string;
    amenities_required?: string[];
    other_requirements?: string;
  };
  userData?: UserDocument;
}

const RoomRequests = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<RoomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByMatch, setSortByMatch] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RoomRequest | null>(null);
  const [messagingUser, setMessagingUser] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const getMatchBadgeClass = (color: string) => {
    if (color === "green") return "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
    if (color === "yellow") return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20";
    if (color === "orange") return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20";
    return "bg-muted text-muted-foreground border border-border";
  };

  const handleMessage = async (searcherId: string) => {
    if (!user) return;
    setMessagingUser(searcherId);
    try {
      const chat = await createChatSession(user.uid, searcherId);
      navigate(`/dashboard/messages?chat=${chat.chat_id}`);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not open chat. Try again.", variant: "destructive" });
    } finally {
      setMessagingUser(null);
    }
  };

  useEffect(() => {
    // Real-time listener for ALL active room requests (simplified query while index builds)
    const requestsQuery = query(
      collection(db, "room_requests"),
      where("status", "==", "active"),
      limit(50)
    );

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        request_id: doc.id,
      })) as RoomRequest[];

      // Filter out user's own requests
      const othersRequests = requestsData.filter(req => req.searcher_id !== user?.uid);

      // Fetch unique user IDs
      const uniqueUserIds = [...new Set(othersRequests.map(r => r.searcher_id))];
      
      // Fetch all user data in parallel
      const usersMap = new Map<string, UserDocument>();
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const userData = await getUser(userId);
          if (userData) {
            usersMap.set(userId, userData);
          }
        })
      );

      const requestsWithUserData = othersRequests
        .map(request => ({
          ...request,
          userData: usersMap.get(request.searcher_id)
        }))
        .sort((a, b) => {
          const aTime = a.created_at?.toMillis?.() || 0;
          const bTime = b.created_at?.toMillis?.() || 0;
          return bTime - aTime;
        });

      setRequests(requestsWithUserData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getDurationLabel = (d?: string) => {
    if (!d) return "";
    const map: Record<string, string> = {
      "1_day": "1 Day", "2_days": "2 Days", "3_days": "3 Days",
      "4_days": "4 Days", "5_days": "5 Days", "6_days": "6 Days",
      "7_days": "1 Week", "1_month": "1 Month",
      "3_months": "3 Months", "6_months": "6 Months", "12_months": "12 Months",
    };
    return map[d] || d.replace(/_/g, " ");
  };

  const getRequestTypeLabel = (type: string) => {
    return type === "emergency" ? "Emergency" : "Long-Term";
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">People looking for rooms</p>
          <div className="flex gap-2 items-center">
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
            <Button variant="action" size="sm" onClick={() => navigate("/dashboard/post-request")}>
              Post Your Request
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active room requests at the moment.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (() => {
          let displayRequests = requests;
          if (sortByMatch && userData) {
            displayRequests = [...requests].sort((a, b) => {
              const sa = matchRequestScore(userData, a).score;
              const sb = matchRequestScore(userData, b).score;
              return sb - sa;
            });
          }
          return (
          <div className="space-y-4">
            {displayRequests.map((req) => {
              const isEmergency = req.request_type === "emergency";
              const match = userData ? matchRequestScore(userData, req) : null;
              
              return (
                <div
                  key={req.request_id}
                  className={`bg-card rounded-xl border p-5 shadow-card ${
                    isEmergency ? "border-secondary" : "border-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {req.userData?.selfie_url ? (
                          <img
                            src={req.userData.selfie_url}
                            alt={req.userData.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {req.userData?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <span className="font-medium text-sm text-foreground">
                          {req.userData?.name || "User"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isEmergency
                              ? "bg-secondary/10 text-secondary"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {getRequestTypeLabel(req.request_type)}
                        </span>
                        {req.userData?.verification_badges && req.userData.verification_badges.length > 0 && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                            ✔ Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-foreground mb-1">{req.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {req.duration.replace(/_/g, " ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {req.location || req.city}
                        </span>
                        <span>
                          Budget: ₹{req.budget_min.toLocaleString()} - ₹{req.budget_max.toLocaleString()}
                        </span>
                        {req.preferences?.gender_preference && req.preferences.gender_preference !== "any" && (
                          <span>Prefers: {req.preferences.gender_preference}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {getTimeAgo(req.created_at)}
                      </span>
                      {req.needed_from && (
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                          Needed: {(req.needed_from?.toDate ? req.needed_from.toDate() : new Date(req.needed_from)).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}                        {match && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getMatchBadgeClass(match.color)}`}>
                            <Zap className="w-2.5 h-2.5" />
                            {match.score}% {match.label}
                          </div>
                        )}                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View Details
                      </Button>
                      <Button variant="brand-outline" size="sm"
                        disabled={messagingUser === req.searcher_id}
                        onClick={() => handleMessage(req.searcher_id)}
                      >
                        {messagingUser === req.searcher_id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <MessageCircle className="w-3 h-3 mr-1" />
                        )}
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
          {selectedRequest && (() => {
            const r = selectedRequest;
            const isEmergency = r.request_type === "emergency";
            return (
              <>
                {/* Header Banner */}
                <div className={`relative px-6 pt-6 pb-5 rounded-t-xl ${
                  isEmergency ? "bg-secondary/10 border-b border-secondary/20" : "bg-primary/5 border-b border-primary/10"
                }`}>
                  {/* User info row */}
                  <div className="flex items-center gap-3 mb-3">
                    {r.userData?.selfie_url ? (
                      <img src={r.userData.selfie_url} alt={r.userData.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-background" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {r.userData?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{r.userData?.name || "User"}</p>
                      {r.userData?.verification_badges && r.userData.verification_badges.length > 0 && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">✔ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isEmergency ? "bg-secondary text-white" : "bg-accent text-accent-foreground"
                      }`}>
                        {isEmergency ? "🚨 Emergency" : "Long-Term"}
                      </span>
                    </div>
                  </div>
                  <DialogTitle className="text-xl font-bold text-foreground leading-snug pr-6">{r.title}</DialogTitle>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {r.location || r.city}{r.location && r.location !== r.city ? `, ${r.city}` : ""}
                    </p>
                    {r.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {(() => {
                          const d = r.created_at?.toDate ? r.created_at.toDate() : new Date(r.created_at);
                          const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
                          return diff === 0 ? "Posted today" : diff === 1 ? "Posted yesterday" : `Posted ${diff}d ago`;
                        })()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Synergy Match Score */}
                  {(() => {
                    const m = userData ? matchRequestScore(userData, r) : null;
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

                  {/* Budget Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Min Budget</p>
                      <p className="font-display font-bold text-primary text-xl">₹{r.budget_min?.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Max Budget</p>
                      <p className="font-display font-bold text-foreground text-xl">₹{r.budget_max?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {r.duration && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />{getDurationLabel(r.duration)}
                        </p>
                      </div>
                    )}
                    {r.needed_from && (
                      <div className="bg-muted/60 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Needed From</p>
                        <p className="text-sm font-semibold text-foreground">
                          {(r.needed_from?.toDate ? r.needed_from.toDate() : new Date(r.needed_from)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    )}
                    <div className="bg-muted/60 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">City</p>
                      <p className="text-sm font-semibold text-foreground">{r.city}</p>
                    </div>
                    <div className="bg-muted/60 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Gender Pref.</p>
                      <p className="text-sm font-semibold text-foreground capitalize flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {r.preferences?.gender_preference && r.preferences.gender_preference !== "any"
                          ? `${r.preferences.gender_preference} only`
                          : "Any"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {r.description && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">About this request</p>
                      <p className="text-sm text-foreground leading-relaxed">{r.description}</p>
                    </div>
                  )}

                  {/* Amenities Required */}
                  {r.preferences?.amenities_required && r.preferences.amenities_required.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Amenities Needed</p>
                      <div className="flex flex-wrap gap-2">
                        {r.preferences.amenities_required.map((a) => (
                          <span key={a} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Requirements */}
                  {r.preferences?.other_requirements && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Requirements</p>
                      <p className="text-sm text-foreground">{r.preferences.other_requirements}</p>
                    </div>
                  )}

                  {isEmergency && (
                    <div className="flex items-start gap-2 bg-secondary/5 border border-secondary/20 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary">
                        <strong>Emergency Request:</strong> This person needs a room urgently within {getDurationLabel(r.duration)}.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="action"
                      size="sm"
                      className="flex-1"
                      disabled={messagingUser === r.searcher_id}
                      onClick={() => { setSelectedRequest(null); handleMessage(r.searcher_id); }}
                    >
                      {messagingUser === r.searcher_id ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <MessageCircle className="w-3 h-3 mr-1" />
                      )}
                      Message {r.userData?.name?.split(" ")[0] || "User"}
                    </Button>
                    <Button
                      variant="brand-outline"
                      size="sm"
                      onClick={() => { setSelectedRequest(null); setProfileUserId(r.searcher_id); }}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      View Profile & Rate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>Close</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* User Profile & Rating Modal */}
      <UserProfileModal
        userId={profileUserId}
        open={!!profileUserId}
        onOpenChange={(open) => !open && setProfileUserId(null)}
      />
    </UserDashboardLayout>
  );
};

export default RoomRequests;
