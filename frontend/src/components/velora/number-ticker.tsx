"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NumberTickerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  startValue?: number;
  /** Seconds to wait after entering the viewport */
  delay?: number;
  /** Duration in seconds of the count-up animation */
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
}

/**
 * Velora UI NumberTicker Component.
 * Smoothly animates numbers upwards when entering the viewport.
 */
export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  duration = 2.2,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  locale = "id-ID",
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(startValue);

  const format = (n: number) => {
    const formattedNum = Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Math.round(n));
    return `${prefix}${formattedNum}${suffix}`;
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startTime: number | null = null;
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          observer.disconnect();

          timeoutId = setTimeout(() => {
            const startNumber = startValue;
            const targetNumber = value;
            const durationMs = duration * 1000;

            const animate = (currentTime: number) => {
              if (startTime === null) startTime = currentTime;
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / durationMs, 1);

              // Ease out exponential curve for refined spring-like deceleration
              const easeOut =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

              const currentVal =
                startNumber + (targetNumber - startNumber) * easeOut;

              setDisplayValue(currentVal);

              if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
              } else {
                setDisplayValue(targetNumber);
              }
            };

            animationFrameId = requestAnimationFrame(animate);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, startValue, delay, duration]);

  return (
    <span
      ref={ref}
      data-slot="number-ticker"
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden>{format(displayValue)}</span>
    </span>
  );
}
