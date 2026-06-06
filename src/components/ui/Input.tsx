import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-line bg-surface/60 px-4 text-base text-cream outline-none transition-colors placeholder:text-muted/70 focus:border-accent/50 focus:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
