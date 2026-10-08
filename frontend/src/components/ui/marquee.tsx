import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reverse the scroll direction */
  reverse?: boolean;
  /** Pause the animation while hovered */
  pauseOnHover?: boolean;
  /** Number of content copies for seamless loop */
  repeat?: number;
  /** Fade the edges with a mask */
  fade?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 3,
  fade = true,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      data-slot="marquee"
      className={cn(
        "group-hover-pause flex overflow-hidden [--duration:50s] [--gap:1.25rem]",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            "flex shrink-0 justify-around gap-(--gap) pr-(--gap)",
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
