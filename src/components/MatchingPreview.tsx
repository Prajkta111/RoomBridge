import { motion } from "framer-motion";
import { GraduationCap, MapPin, Briefcase, Users, Star } from "lucide-react";

const matchTypes = [
  { icon: GraduationCap, label: "Same College Rooms", color: "bg-primary" },
  { icon: MapPin, label: "Same Hometown Rooms", color: "bg-secondary" },
  { icon: Briefcase, label: "Same Profession", color: "bg-primary" },
  { icon: Users, label: "Best Matches For You", color: "bg-secondary" },
  { icon: Star, label: "Nearby Rooms", color: "bg-primary" },
];

const MatchingPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Smart Matching,{" "}
              <span className="text-gradient-brand">Not Random Listings</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Our algorithm personalizes your feed based on your education, profession, hometown, and preferences — so you find the perfect vibe match.
            </p>
            <div className="space-y-3">
              {matchTypes.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-foreground text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mock preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border shadow-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">🔥 Best Match</span>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">🎓 Same College</span>
            </div>
            <div className="h-40 rounded-xl bg-muted mb-4 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Room Preview Image</span>
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">Spacious Room near IIT Gate</h3>
            <p className="text-sm text-muted-foreground mb-3">2 BHK shared • Furnished • AC</p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-primary">₹6,500<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="text-sm font-medium text-foreground">4.8</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">✔ ID Verified</span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">✔ Student Verified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MatchingPreview;
