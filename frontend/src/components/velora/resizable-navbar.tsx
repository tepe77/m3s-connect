"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface ResizableNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Links shown in the bar (and in the mobile menu) */
  items: NavItem[];
  /** Brand mark or logo link on the left */
  logo?: React.ReactNode;
  /** Call to action on the right (e.g. sign-in/up or profile) */
  cta?: React.ReactNode;
  /** Pixels scrolled before the bar shrinks into a floating pill */
  threshold?: number;
  /** Maximum width of the floating pill, in px */
  compactWidth?: number;
  /** Maximum width of the full bar, in px */
  maxWidth?: number;
  /** href of the current page; that link gets aria-current="page" */
  activeHref?: string;
  /** Accessible name of the navigation landmark */
  label?: string;
}

/**
 * Full-width glass navbar at the top that smoothly shrinks into a centered,
 * blurred floating pill once scrolled past the threshold.
 */
export function ResizableNavbar({
  items,
  logo,
  cta,
  threshold = 40,
  compactWidth = 960,
  maxWidth = 1400,
  activeHref,
  label = "Main",
  className,
  ...props
}: ResizableNavbarProps) {
  const [compact, setCompact] = useState(false);
  const [hover, setHover] = useState<{
    left: number;
    width: number;
    on: boolean;
    moved: boolean;
  }>({ left: 0, width: 0, on: false, moved: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setCompact(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const show = ({ currentTarget: t }: React.SyntheticEvent<HTMLElement>) => {
    setHover((prev) => ({
      left: t.offsetLeft,
      width: t.offsetWidth,
      on: true,
      moved: prev.on,
    }));
  };

  const hide = () => {
    setHover((prev) => ({
      ...prev,
      on: false,
      moved: false,
    }));
  };

  const link = (item: NavItem, inMenu: boolean) => {
    const isActive =
      item.href === "/"
        ? activeHref === "/"
        : activeHref?.startsWith(item.href);

    return (
      <a
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={inMenu ? undefined : show}
        onFocus={inMenu ? undefined : show}
        onClick={() => setMenuOpen(false)}
        className={cn(
          "relative block rounded-full px-3.5 py-1.5 text-xs sm:text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]",
          isActive
            ? "text-[#0D9488] font-bold"
            : "text-slate-600 hover:text-slate-900 font-medium",
          inMenu && "rounded-xl px-4 py-2.5 text-sm hover:bg-slate-100"
        )}
      >
        {item.label}
        {!inMenu && isActive && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[#0D9488]" />
        )}
      </a>
    );
  };

  return (
    <header
      {...props}
      ref={rootRef}
      data-slot="resizable-navbar"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          buttonRef.current?.focus();
        }
        props.onKeyDown?.(event);
      }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        compact
          ? "pt-2.5 sm:pt-3 px-3 sm:px-6 bg-transparent pointer-events-none"
          : "pt-0 px-0 bg-white/70 backdrop-blur-md",
        className
      )}
    >
      {/* 1px bottom divider line when at top, fades out on scroll */}
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 inset-x-0 h-px bg-slate-200/60 pointer-events-none transition-opacity duration-300",
          compact ? "opacity-0" : "opacity-100"
        )}
      />

      <nav
        aria-label={label}
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          compact
            ? "pointer-events-auto max-w-4xl sm:max-w-5xl h-14 px-4 sm:px-6 rounded-full border border-slate-200/90 bg-white/90 shadow-md shadow-emerald-950/[0.04] backdrop-blur-md"
            : "w-full max-w-[1400px] h-20 px-4 sm:px-6 lg:px-8 rounded-none border border-transparent bg-transparent shadow-none"
        )}
      >
        {/* Logo Left */}
        <div className="flex shrink-0 items-center">{logo}</div>

        {/* Center Links (Desktop) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div
            onMouseLeave={hide}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) hide();
            }}
            className="relative py-1"
          >
            {/* Sliding Capsule Indicator */}
            <span
              aria-hidden
              style={{
                transform: `translateX(${hover.left}px)`,
                width: `${hover.width}px`,
                opacity: hover.on ? 1 : 0,
                transition: hover.moved
                  ? "transform 240ms cubic-bezier(0.16, 1, 0.3, 1), width 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease"
                  : "opacity 150ms ease",
              }}
              className="absolute inset-y-1 left-0 rounded-full bg-slate-100/90 pointer-events-none -z-0"
            />
            <ul className="flex items-center gap-1 relative z-10">
              {items.map((item, i) => (
                <li key={`${i}-${item.label}`}>{link(item, false)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA / Auth Right */}
        {cta && <div className="hidden sm:flex shrink-0 items-center gap-2">{cta}</div>}

        {/* Hamburger Toggle (Mobile) */}
        <button
          ref={buttonRef}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? `${id}-menu` : undefined}
          onClick={() => setMenuOpen((open) => !open)}
          className="lg:hidden ml-auto flex size-9 cursor-pointer items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={cn(
                "absolute left-0 top-0 h-0.5 w-4 rounded-full bg-slate-700 transition-transform duration-200",
                menuOpen && "translate-y-[5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-4 rounded-full bg-slate-700 transition-transform duration-200",
                menuOpen && "-translate-y-[5px] -rotate-45"
              )}
            />
          </span>
        </button>

        {/* Mobile Disclosure Menu */}
        {menuOpen && (
          <div
            id={`${id}-menu`}
            className={cn(
              "pointer-events-auto bg-white/95 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden",
              compact
                ? "absolute inset-x-0 top-full mx-auto max-w-lg mt-2 rounded-2xl border border-slate-200/90 p-4"
                : "w-full border-b border-slate-200/80 px-4 py-4"
            )}
          >
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={`${i}-${item.label}`}>{link(item, true)}</li>
              ))}
            </ul>
            {cta && <div className="mt-3 border-t border-slate-200 pt-3">{cta}</div>}
          </div>
        )}
      </nav>
    </header>
  );
}
