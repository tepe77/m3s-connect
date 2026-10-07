import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "emerald" | "amber" | "blue";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default: "border-transparent bg-[#0D9488] text-white shadow-2xs hover:bg-[#0f766e]",
    emerald: "border-emerald-200 bg-emerald-50 text-[#0D9488]",
    secondary: "border-slate-200 bg-slate-100 text-[#334155]",
    destructive: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    outline: "border-[#CBD5E1] text-[#0F172A]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
