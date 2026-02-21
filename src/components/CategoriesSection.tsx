import { motion } from "framer-motion";
import { Building, Users, Clock, AlertTriangle } from "lucide-react";

const categories = [
  {
    icon: Building,
    title: "Long-Term Rental",
    description: "Furnished & unfurnished rooms for 6+ months stays.",
    count: "2,400+ listings",
  },
  {
    icon: Users,
    title: "PG Accommodation",
    description: "Paying guest rooms with meals and amenities included.",
    count: "1,800+ listings",
  },
  {
    icon: Clock,
    title: "Short Stay",
    description: "1–3 day stays for exams, interviews, or quick visits.",
    count: "600+ listings",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Rooms",
    description: "Verified rooms available for immediate move-in.",
    count: "Available now",
    emergency: true,
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Find What <span className="text-gradient-brand">You Need</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse rooms by category tailored to your situation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`group rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                cat.emergency
                  ? "bg-secondary/10 border-2 border-secondary shadow-action"
                  : "bg-card border border-border shadow-card hover:shadow-card-hover"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  cat.emergency ? "bg-gradient-action" : "bg-gradient-brand"
                }`}
              >
                <cat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
              <span
                className={`text-xs font-semibold ${
                  cat.emergency ? "text-secondary" : "text-primary"
                }`}
              >
                {cat.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
