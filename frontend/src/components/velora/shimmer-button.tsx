import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
}

export function ShimmerButton({
  children,
  className,
  href,
  ...props
}: ShimmerButtonProps) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2 font-semibold">
        {children}
      </span>
      <span
        aria-hidden
        className="motion-safe:animate-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] bg-[length:250%_100%]"
      />
    </>
  );

  const sharedClasses = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-[#0f766e] hover:shadow-lg hover:shadow-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    className
  );

  if (href) {
    return (
      <Link href={href} className={sharedClasses}>
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
