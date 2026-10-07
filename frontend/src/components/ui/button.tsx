import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "emerald";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variantStyles: Record<string, string> = {
      default: "bg-[#0D9488] text-white shadow-xs hover:bg-[#0f766e] active:scale-[0.98]",
      emerald: "bg-[#0D9488] text-white shadow-xs hover:bg-[#0f766e] active:scale-[0.98]",
      destructive: "bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:scale-[0.98]",
      outline: "border border-[#CBD5E1] bg-white text-[#0F172A] shadow-2xs hover:bg-slate-50 hover:text-[#0D9488] active:scale-[0.98]",
      secondary: "bg-slate-100 text-[#0F172A] shadow-2xs hover:bg-slate-200/80 active:scale-[0.98]",
      ghost: "text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]",
      link: "text-[#0D9488] underline-offset-4 hover:underline",
    };

    const sizeStyles: Record<string, string> = {
      default: "h-9 px-4 py-2 text-xs",
      sm: "h-8 rounded-lg px-3 text-[11px]",
      lg: "h-11 rounded-2xl px-6 text-sm",
      icon: "h-8 w-8 rounded-xl p-0",
      pill: "h-9 px-5 rounded-full text-xs",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/30 disabled:pointer-events-none disabled:opacity-50 select-none",
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
