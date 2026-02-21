import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Button } from "@/components/ui/button";

const PostRoomRequest = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-1">I Need a Room</h2>
            <p className="text-sm text-muted-foreground">Post your requirement so room owners can find you.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">What are you looking for?</label>
              <input type="text" placeholder="e.g. Room near BITS Pilani for exam" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Required Date</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Duration</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>1-3 Days (Emergency)</option>
                  <option>1 Week</option>
                  <option>1 Month</option>
                  <option>3+ Months</option>
                  <option>6+ Months</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Budget</label>
                <input type="text" placeholder="e.g. ₹500/day or ₹7000/mo" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Preferred Gender</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Any</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Location / City</label>
              <input type="text" placeholder="e.g. Kota, Rajasthan" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Additional Details</label>
              <textarea rows={3} placeholder="Any preferences for roommate, hometown match, etc." className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </div>

          <Button variant="action" size="lg" className="w-full">Post Room Request</Button>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default PostRoomRequest;
