"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** The target number to count up to. */
  target: number;
  /** Animation duration in seconds. Defaults to 2. */
  duration?: number;
  /** Text to display before the number (e.g. "$"). */
  prefix?: string;
  /** Text to display after the number (e.g. "%"). */
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, target, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      // If the target is a whole number, display whole numbers.
      // Otherwise display one decimal place.
      if (Number.isInteger(target)) {
        setDisplayValue(Math.round(latest));
      } else {
        setDisplayValue(
          Math.round(latest * 10) / 10
        );
      }
    });
    return unsubscribe;
  }, [springValue, target]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
