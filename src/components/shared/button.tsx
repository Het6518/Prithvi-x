"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  const styles = {
    primary:
      "bg-forest text-background shadow-ambient hover:bg-moss",
    secondary:
      "border border-forest/15 bg-white/80 text-forest hover:border-gold/40 hover:text-ink",
    ghost:
      "bg-transparent text-forest hover:bg-forest/5"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5",
        styles[variant],
        className
      )}
      {...props}
    />
  );
});
