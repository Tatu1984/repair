"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  /** The text to type out. */
  text: string;
  /** Typing speed in milliseconds per character. Defaults to 50. */
  speed?: number;
  className?: string;
  /** Whether to show a blinking cursor. Defaults to true. */
  cursor?: boolean;
}

export function TypingText({
  text,
  speed = 50,
  className,
  cursor = true,
}: TypingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    setDisplayedText("");
    setIsComplete(false);

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, text, speed]);

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {displayedText}
      {cursor && (
        <span
          className={cn(
            "ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-current align-text-bottom",
            isComplete && "animate-pulse"
          )}
        />
      )}
    </motion.span>
  );
}
