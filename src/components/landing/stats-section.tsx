"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Wrench, Star, Clock } from "lucide-react";

interface StatItem {
  icon: typeof Users;
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  color: string;
  bg: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    prefix: "",
    label: "Breakdowns Resolved",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Wrench,
    value: 2500,
    suffix: "+",
    prefix: "",
    label: "Verified Mechanics",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Star,
    value: 4.8,
    suffix: "",
    prefix: "",
    label: "Average Rating",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Clock,
    value: 15,
    suffix: " Min",
    prefix: "<",
    label: "Average Response Time",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

function AnimatedCounter({
  value,
  suffix,
  prefix,
  isInView,
}: {
  value: number;
  suffix: string;
  prefix: string;
  isInView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut" as const,
      onUpdate: (latest) => {
        if (isDecimal) {
          setDisplayValue(parseFloat(latest.toFixed(1)));
        } else {
          setDisplayValue(Math.floor(latest));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, isDecimal]);

  const formattedValue = isDecimal
    ? displayValue.toFixed(1)
    : displayValue.toLocaleString();

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
              >
                <stat.icon className={`size-7 ${stat.color}`} />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isInView={isInView}
                />
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
