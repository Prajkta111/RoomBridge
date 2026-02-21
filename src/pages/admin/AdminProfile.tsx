import { useState, useRef } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
import { Camera, Loader2, Lock, User, Eye, EyeOff } from "lucide-react";

const AdminProfile = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(userData?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const adminPhoto = (userData as any)?.selfie_url || null;
  const adminInitial = userData?.name?.charAt(0)?.toUpperCase() || "A";

  // Save name
  const handleSaveProfile = async () => {
    if (!user || !name.trim()) return;
    setSavingProfile(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        updated_at: serverTimestamp(),
      });
      await refreshUserData();
      toast({ title: "Profile updated", description: "Your name has been saved." });
    } catch {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  // Upload photo
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" });
      return;
    }
    setUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `admin_avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", user.uid), {
        selfie_url: url,
        updated_at: serverTimestamp(),
      });
      await refreshUserData();
      toast({ title: "Photo updated" });
    } catch {
      toast({ title: "Error", description: "Failed to upload photo.", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "At least 6 characters required.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password changed", description: "Your password has been updated successfully." });
    } catch (err: any) {
      const msg =
        err.code === "auth/wrong-password" ? "Current password is incorrect." :
        err.code === "auth/too-many-requests" ? "Too many attempts. Try again later." :
        "Failed to change password.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">

        {/* Profile card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
          <h2 className="font-display text-base font-bold text-foreground">Admin Profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              {adminPhoto ? (
                <img src={adminPhoto} alt="Admin" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {adminInitial}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white shadow-md border-2 border-background hover:bg-primary/90 transition-colors"
              >
                {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{userData?.name || "Admin"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-secondary font-semibold mt-1">Administrator</p>
            </div>
          </div>

          {/* Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            variant="brand"
            size="sm"
            onClick={handleSaveProfile}
            disabled={savingProfile || !name.trim()}
          >
            {savingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : "Save Profile"}
          </Button>
        </div>

        {/* Change password card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display text-base font-bold text-foreground">Change Password</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Button
            variant="action"
            size="sm"
            onClick={handleChangePassword}
            disabled={savingPassword}
          >
            {savingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : "Update Password"}
          </Button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfile;
