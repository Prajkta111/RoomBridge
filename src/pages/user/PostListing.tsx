import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Button } from "@/components/ui/button";

const PostListing = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-1">Post a Room Listing</h2>
            <p className="text-sm text-muted-foreground">Fill in details to list your room for students and professionals.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Listing Title</label>
              <input type="text" placeholder="e.g. Spacious Room near IIT Gate" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Listing Type</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Long-Term Rental</option>
                  <option>PG Accommodation</option>
                  <option>Flatmate Replacement</option>
                  <option>Short Stay (1-3 days)</option>
                  <option>Emergency Availability</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Monthly Rent (₹)</label>
                <input type="number" placeholder="e.g. 6500" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Location</label>
              <input type="text" placeholder="e.g. Powai, Mumbai" className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
              <textarea rows={4} placeholder="Describe the room, amenities, nearby landmarks..." className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Gender Preference</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Any</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Furnishing</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Furnished</option>
                  <option>Semi-Furnished</option>
                  <option>Unfurnished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Room Photos</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">Drag & drop images or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Max 5 images, 5MB each</p>
              </div>
            </div>
          </div>

          <Button variant="action" size="lg" className="w-full">Publish Listing</Button>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default PostListing;
