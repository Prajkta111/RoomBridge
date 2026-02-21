import { motion } from "framer-motion";
import { UserCheck, Brain, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Register & Verify",
    description: "Sign up with your details and verify your identity with Aadhaar/PAN and a live selfie.",
  },
  {
    icon: Brain,
    title: "Get Smart Matches",
    description: "Our algorithm matches you based on college, profession, hometown, and preferences.",
  },
  {
    icon: MessageCircle,
    title: "Connect Safely",
    description: "Chat securely in-app, check ratings, and move in with confidence.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            How It <span className="text-gradient-brand">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three simple steps to your perfect room.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand mx-auto mb-5 flex items-center justify-center shadow-brand">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-sm font-semibold text-secondary mb-2">Step {i + 1}</div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
