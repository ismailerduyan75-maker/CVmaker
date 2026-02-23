"use client";

import Link from "next/link";

const gradientClass =
  "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold";

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

export function BrandLogo({ href = "/", className = "", size = "md" }: BrandLogoProps) {
  const text = (
    <span className={`${gradientClass} ${sizeClasses[size]} tracking-tight ${className}`}>
      CVcraft
    </span>
  );
  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {text}
      </Link>
    );
  }
  return text;
}
