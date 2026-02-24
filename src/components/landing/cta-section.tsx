"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Smartphone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Decorative orbs */}
      <motion.div
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Never Get{" "}
            <span className="underline decoration-white/30 underline-offset-4">
              Stranded
            </span>{" "}
            Again?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Download RepairAssist today and ride with confidence. Help is always
            just one tap away.
          </p>
        </motion.div>

        {/* App store buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* App Store Button */}
          <Link
            href="#"
            className="group flex h-14 w-52 items-center gap-3 rounded-xl bg-white/10 px-5 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20 hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 flex-shrink-0 fill-white"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium leading-none text-white/70">
                Download on the
              </span>
              <span className="text-base font-semibold leading-tight text-white">
                App Store
              </span>
            </div>
          </Link>

          {/* Google Play Button */}
          <Link
            href="#"
            className="group flex h-14 w-52 items-center gap-3 rounded-xl bg-white/10 px-5 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20 hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 flex-shrink-0 fill-white"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium leading-none text-white/70">
                Get it on
              </span>
              <span className="text-base font-semibold leading-tight text-white">
                Google Play
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Mechanic CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/register?role=mechanic"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <Wrench className="size-4" />
            Are you a mechanic? Register as a service partner
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
