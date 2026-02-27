"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Wrench,
  Phone,
  Navigation,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floatingElements = [
  {
    icon: MapPin,
    className: "top-[15%] left-[8%]",
    delay: 0,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Wrench,
    className: "top-[25%] right-[12%]",
    delay: 0.5,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Phone,
    className: "bottom-[30%] left-[5%]",
    delay: 1,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    className: "bottom-[20%] right-[8%]",
    delay: 1.5,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Navigation,
    className: "top-[60%] right-[20%]",
    delay: 0.8,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Zap,
    className: "top-[50%] left-[15%]",
    delay: 1.2,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/[0.03] via-background to-background pt-16">
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large gradient orb */}
        <motion.div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating icons */}
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            className={`absolute ${el.className} hidden md:block`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + el.delay, duration: 0.5 }}
          >
            <motion.div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${el.bg} shadow-lg shadow-black/5`}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: el.delay,
              }}
            >
              <el.icon className={`size-5 ${el.color}`} />
            </motion.div>
          </motion.div>
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-24 pb-16 sm:px-6 sm:pt-32 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:pt-40">
        {/* Left: text content */}
        <motion.div
          className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Now live across 50+ cities in India
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Emergency Breakdown Help,{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Stranded on the road? Connect instantly with verified, nearby
            mechanics who come to you. Real-time tracking, transparent pricing,
            and cashless payments -- all in one app.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25" asChild>
              <Link href="/login">
                <Zap className="size-5" />
                Get Help Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link href="/login">
                <Wrench className="size-5" />
                Join as Mechanic
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="size-4 text-emerald-600" />
              <span>Verified Mechanics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation className="size-4 text-primary" />
              <span>Live Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-4 text-amber-600" />
              <span>15 min avg</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: phone mockup illustration */}
        <motion.div
          className="mt-16 flex w-full max-w-md flex-shrink-0 items-center justify-center lg:mt-0 lg:max-w-lg"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="relative mx-auto h-[520px] w-[260px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/10 bg-gradient-to-b from-primary/5 to-primary/10 shadow-2xl shadow-primary/10">
              {/* Status bar */}
              <div className="flex h-10 items-center justify-center bg-foreground/5">
                <div className="h-3 w-20 rounded-full bg-foreground/10" />
              </div>

              {/* App content mockup */}
              <div className="space-y-4 p-4">
                {/* Map area */}
                <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-50">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  {/* Animated pulse dot */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-3 animate-ping rounded-full bg-primary/20" />
                      <div className="absolute -inset-2 rounded-full bg-primary/10" />
                      <div className="relative h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                    </div>
                  </motion.div>
                  {/* Mechanic dot */}
                  <motion.div
                    className="absolute right-8 top-8"
                    animate={{ x: [-3, 3, -3], y: [2, -2, 2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                      <Wrench className="size-3.5 text-white" />
                    </div>
                  </motion.div>
                </div>

                {/* SOS Button */}
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-red-600 font-bold text-white shadow-lg shadow-red-500/30">
                    SOS - Get Help Now
                  </div>
                </motion.div>

                {/* Info cards */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="size-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-24 rounded bg-foreground/10" />
                      <div className="mt-1.5 h-2 w-16 rounded bg-foreground/5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                      <Shield className="size-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-28 rounded bg-foreground/10" />
                      <div className="mt-1.5 h-2 w-20 rounded bg-foreground/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative rings */}
            <motion.div
              className="absolute -inset-8 rounded-[3rem] border border-primary/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-16 rounded-[4rem] border border-primary/5"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
