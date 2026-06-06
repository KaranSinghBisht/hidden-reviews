import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-accent text-ink shadow-lg shadow-accent/20 hover:bg-accent-strong",
        variant === "ghost" && "border border-line text-cream hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
