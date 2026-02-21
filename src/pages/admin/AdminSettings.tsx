import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  return (
    <AdminDashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
          <h2 className="font-display text-xl font-bold text-foreground">Platform Settings</h2>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Auto-Expire Emergency Requests (days)</label>
            <input type="number" defaultValue={3} className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Reports Before Auto-Block</label>
            <input type="number" defaultValue={3} className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-3">
            {["Allow unverified users to post listings", "Enable emergency room feature", "Enable in-app chat", "Enable rating system"].map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-ring" />
                <span className="text-sm text-foreground">{s}</span>
              </label>
            ))}
          </div>
          <Button variant="brand" size="default">Save Settings</Button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettings;
