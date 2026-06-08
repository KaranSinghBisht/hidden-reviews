"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface RedactedProps {
  children: ReactNode;
  /** Stagger when several reveal together (seconds). */
  delay?: number;
  /** Element tag for the wrapper. */
  as?: ElementType;
  className?: string;
  /** Force-revealed (skip the bar) — used for teasers that stay redacted. */
  revealed?: boolean;
  /** Keep it redacted: show the censor bar, never wipe (archive teasers). */
  locked?: boolean;
}

/**
 * The signature interaction: text loads behind a censor bar, then the bar
 * wipes away left→right to "declassify" it. The real text is always in the
 * DOM (selectable, screen-reader friendly); the bar is decorative.
 */
export function Redacted({
  children,
  delay = 0,
  as,
  className = "",
  revealed = false,
  locked = false,
}: RedactedProps) {
  const Tag = (as ?? "span") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const show = revealed || reduce || (inView && !locked);

  return (
    <Tag ref={ref} className={`relative block ${className}`}>
      <span className="relative z-0">{children}</span>
      <motion.span
        aria-hidden
        className="absolute inset-0 z-10 origin-left rounded-[2px] bg-redact shadow-[inset_0_1px_0_rgba(245,241,234,0.06),inset_0_0_0_1px_rgba(0,0,0,0.5)]"
        initial={false}
        animate={{ scaleX: show ? 0 : 1 }}
        transition={{
          duration: 0.55,
          ease: [0.65, 0, 0.35, 1],
          delay: show ? delay : 0,
        }}
      />
    </Tag>
  );
}
