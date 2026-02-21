import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EmergencyBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-action py-10"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-primary-foreground">
              Need a Room Urgently?
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              For exams or urgent shifts — find verified emergency stays instantly.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground font-semibold"
          asChild
        >
          <Link to="/browse?type=emergency">
            Find Emergency Room
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
};

export default EmergencyBanner;
