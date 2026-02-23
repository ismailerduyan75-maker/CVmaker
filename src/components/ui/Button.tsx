"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 min-w-[2.5rem] min-h-[2.5rem]";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost:
      "text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
    danger:
      "border border-red-500/50 text-red-400 hover:bg-red-500/10",
  };

  return (
    <motion.button
      type={type}
      whileTap={!loading && !disabled ? { scale: 0.98 } : undefined}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="sr-only">Yükleniyor</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
