"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MapPin,
  ShieldCheck,
  Package,
  IndianRupee,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    description:
      "Track your mechanic live on the map as they make their way to you. Know exactly when help will arrive with accurate ETAs.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/30",
  },
  {
    icon: ShieldCheck,
    title: "Verified Mechanics",
    description:
      "Every mechanic on our platform is background-verified, skill-tested, and rated by real users. Your safety comes first.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "group-hover:border-emerald-300",
  },
  {
    icon: Package,
    title: "Spare Parts Marketplace",
    description:
      "Need a part? Browse genuine spare parts from trusted vendors with doorstep delivery and warranty assurance.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "group-hover:border-violet-300",
  },
  {
    icon: IndianRupee,
    title: "Instant Pricing",
    description:
      "Get upfront, transparent cost estimates before confirming. No hidden charges, no surprises -- just honest pricing.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "group-hover:border-amber-300",
  },
  {
    icon: MessageCircle,
    title: "Live Chat & Calling",
    description:
      "Communicate directly with your assigned mechanic via in-app chat or calling. Stay informed at every step of the repair.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "group-hover:border-sky-300",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay securely via UPI, cards, or wallets. Get a digital invoice for every service with complete transaction history.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "group-hover:border-rose-300",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for{" "}
            <span className="text-primary">Roadside Emergencies</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From the moment you break down to when you are back on the road, we
            have got you covered with a complete suite of tools.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          ref={ref}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card
                className={`group relative h-full cursor-default overflow-hidden border transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 ${feature.border}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className={`size-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
