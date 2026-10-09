import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  duration?: string;
  shimmerColor?: string;
}

export function ShimmerButton({
  children,
  className,
  href,
  duration = "4.5s",
  shimmerColor = "rgba(255, 255, 255, 0.28)",
  ...props
}: ShimmerButtonProps) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2 font-semibold">
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[length:200%_100%] animate-shimmer"
        style={{
          backgroundImage: `linear-gradient(110deg, transparent 25%, ${shimmerColor} 50%, transparent 75%)`,
          animation: `shimmer ${duration} linear infinite`,
        }}
      />
    </>
  );

  const sharedClasses = cn(
    "group/shimmer relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0D9488] px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-emerald-900/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    className
  );

  if (href) {
    return (
      <Link href={href} data-slot="shimmer-button" className={sharedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button data-slot="shimmer-button" className={sharedClasses} {...props}>
      {content}
    </button>
  );
}

