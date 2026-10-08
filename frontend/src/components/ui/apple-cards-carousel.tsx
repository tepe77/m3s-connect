"use client";

import React, {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

export interface CardsCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `CarouselCard` elements */
  children: React.ReactNode;
  /** Accessible name for the scrollable region */
  label?: string;
  /** Custom class name */
  className?: string;
}

/** Snap-scrolling row of `CarouselCard`s with drag support and previous/next buttons. */
export function CardsCarousel({
  children,
  label = "Dokumentasi Mayoga",
  className,
  ...props
}: CardsCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState(1); // 1: at start, 2: at end, 3: both, 0: middle
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    setEdge((+atStart) | ((+atEnd) << 1));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  // Convert vertical mouse wheel into horizontal scroll inside carousel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaY) > 4) {
        // Only divert if horizontal overflow exists
        if (el.scrollWidth > el.clientWidth) {
          const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
          const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth && e.deltaY > 0;
          if (!atStart && !atEnd) {
            e.preventDefault();
            el.scrollLeft += e.deltaY * 0.9;
            measure();
          }
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [measure]);

  // Mouse Drag To Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    measure();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scrollByDirection = (direction: number) => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
    setTimeout(measure, 350);
  };

  return (
    <div data-slot="cards-carousel" className={cn("w-full min-w-0 relative", className)} {...props}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={measure}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          "snap-x snap-mandatory scroll-px-3 overflow-x-auto rounded-3xl scrollbar-none focus-visible:outline-2 focus-visible:outline-emerald-500 [&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <ul className="flex w-max gap-4 px-2 py-3">
          {Children.map(children, (child) => (
            <li className="snap-start list-none">{child}</li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-2.5 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-[#0D9488]" />
          <span className="text-[11px] font-medium">Geser untuk melihat dokumentasi lainnya</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous documentation cards"
            disabled={!!(edge & 1)}
            onClick={() => scrollByDirection(-1)}
            className="cursor-pointer inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next documentation cards"
            disabled={!!(edge & 2)}
            onClick={() => scrollByDirection(1)}
            className="cursor-pointer inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export interface CarouselCardProps {
  /** Cover image URL */
  src: string;
  /** Small label above the title */
  category: string;
  /** Card title and dialog heading */
  title: string;
  /** Rich content shown once the card is opened in modal */
  children: React.ReactNode;
  /** Extra classes for the card */
  className?: string;
  /** Optional date/info badge */
  date?: string;
  /** Optional count badge (e.g. '128 Foto') */
  count?: string;
}

/** A tall image card for `CardsCarousel`; clicking it opens a modal story dialog. */
export function CarouselCard({
  src,
  category,
  title,
  children,
  className,
  date,
  count,
}: CarouselCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Modal: scroll lock, focus trap, Escape, focus restore.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const dialog = dialogRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href],button:not(:disabled),input:not(:disabled),select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey ? active === first || active === dialog : active === last) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  // Portal the dialog to <body> safely
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-slot="carousel-card"
        className={cn(
          "group/carousel-card relative flex h-72 w-52 sm:h-84 sm:w-60 flex-col items-start justify-between overflow-hidden rounded-3xl bg-slate-900 p-5 text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 select-none cursor-pointer",
          className
        )}
      >
        {/* Cover Image */}
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 640px) 210px, 240px"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/carousel-card:scale-105"
        />

        {/* Ambient Gradient Overlays */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 pointer-events-none"
        />

        {/* Card Top Category & Badges */}
        <div className="relative z-10 w-full flex items-center justify-between gap-2">
          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-700/80 backdrop-blur-xs">
            {category}
          </span>
          {count && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{count}</span>
            </span>
          )}
        </div>

        {/* Card Bottom: Title & Meta */}
        <div className="relative z-10 w-full mt-auto">
          {date && (
            <p className="text-[10px] font-medium text-slate-300 mb-1">
              {date}
            </p>
          )}
          <h3 className="font-bold leading-snug text-white text-sm sm:text-base line-clamp-2 drop-shadow-sm group-hover/carousel-card:text-emerald-200 transition-colors">
            {title}
          </h3>

          {/* Plus Icon Trigger Button */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/15">
            <span className="text-[10px] font-semibold text-white/70 group-hover/carousel-card:text-white transition-colors">
              Lihat Detail
            </span>
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition-transform group-hover/carousel-card:scale-110 group-hover/carousel-card:bg-emerald-400 group-hover/carousel-card:text-emerald-950"
            >
              <Plus className="size-4 stroke-[2.5]" />
            </span>
          </div>
        </div>
      </button>

      {/* Modal Dialog */}
      {hydrated &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 md:py-12 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            />

            {/* Dialog Container */}
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-heading`}
              tabIndex={-1}
              className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 outline-none animate-in zoom-in-95 duration-200"
            >
              {/* Modal Hero Image */}
              <div className="relative flex h-60 sm:h-72 flex-col items-start justify-between p-6 sm:p-8">
                <Image
                  src={src}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="absolute inset-0 size-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35 pointer-events-none"
                />

                <div className="relative z-10 w-full flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-emerald-600/90 backdrop-blur-xs">
                    {category}
                  </span>
                  <button
                    type="button"
                    aria-label="Tutup"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition-colors focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="relative z-10 w-full">
                  {date && (
                    <span className="text-xs font-medium text-emerald-300 mb-1 block">
                      {date} {count ? `• ${count}` : ""}
                    </span>
                  )}
                  <h2
                    id={`${id}-heading`}
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight"
                  >
                    {title}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {children}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
