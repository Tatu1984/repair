"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  CircleDot,
  Radar,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    icon: CircleDot,
    title: "Request Help",
    description:
      "Tap the SOS button and share your location. Describe the issue or let our AI diagnose it from a photo.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    gradient: "from-rose-500 to-rose-600",
  },
  {
    number: "02",
    icon: Radar,
    title: "Get Matched",
    description:
      "Our AI instantly finds the nearest verified mechanic with the right skills for your vehicle and issue.",
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/20",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    number: "03",
    icon: Navigation,
    title: "Track Arrival",
    description:
      "Watch your mechanic en route in real-time on the map. Get live ETA updates and chat directly.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Fixed & Pay",
    description:
      "Transparent pricing shown upfront. Pay digitally and receive an instant invoice. Rate your experience.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    gradient: "from-amber-500 to-amber-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Back on the Road in{" "}
            <span className="text-primary">4 Simple Steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting help has never been easier. Our streamlined process ensures
            you get the fastest response possible.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          className="relative mt-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 lg:block">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-300 via-primary/40 via-emerald-300 to-amber-300"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {/* Connecting line (mobile) */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 lg:hidden">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-rose-300 via-primary/40 via-emerald-300 to-amber-300"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center"
              >
                {/* Number badge + Icon */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg} ring-4 ${step.ring} ring-offset-2 ring-offset-background`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className={`size-7 ${step.color}`} />
                  </motion.div>
                  {/* Number */}
                  <div
                    className={`absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-xs font-bold text-white shadow-md`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:mt-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
