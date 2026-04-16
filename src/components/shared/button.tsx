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
    primary: "neo-btn-primary",
    secondary: "neo-btn-secondary",
    ghost: "neo-btn-ghost"
  };

  return (
    <button
      ref={ref}
      className={cn(styles[variant], className)}
      {...props}
    />
  );
});
