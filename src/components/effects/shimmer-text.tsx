"use client";

import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  /** Animation duration in seconds. Defaults to 2. */
  speed?: number;
}

export function ShimmerText({
  children,
  className,
  speed = 2,
}: ShimmerTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-[length:200%_100%] animate-[shimmer_var(--shimmer-speed)_linear_infinite]",
        "bg-gradient-to-r from-foreground via-foreground/50 to-foreground",
        className
      )}
      style={
        {
          "--shimmer-speed": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      {children}
    </span>
  );
}
