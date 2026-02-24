"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  /** Array of CSS color strings for the floating blobs. Defaults to purple/blue/pink. */
  colors?: string[];
}

const defaultColors = [
  "rgba(128, 0, 255, 0.4)",
  "rgba(0, 128, 255, 0.4)",
  "rgba(255, 0, 128, 0.4)",
];

export function GradientBackground({
  className,
  colors = defaultColors,
}: GradientBackgroundProps) {
  // Use at least 3 blobs; cycle through colors if fewer are provided
  const blobCount = Math.max(colors.length, 3);

  const blobs = Array.from({ length: blobCount }, (_, i) => ({
    color: colors[i % colors.length],
    size: 300 + (i * 80),
    initialX: `${20 + (i * 25) % 60}%`,
    initialY: `${15 + (i * 30) % 60}%`,
  }));

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

      {/* Floating blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
            left: blob.initialX,
            top: blob.initialY,
            translate: "-50% -50%",
          }}
          animate={{
            x: [0, 80, -60, 40, 0],
            y: [0, -60, 40, -80, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]" />
    </div>
  );
}
