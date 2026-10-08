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
 * Sticky navbar that shrinks into a centered, blurred pill once the page is
 * scrolled. A highlight glides between links on hover and focus; below 48rem
 * the links fold into a disclosure menu.
 */
export function ResizableNavbar({
  items,
  logo,
  cta,
  threshold = 60,
  compactWidth = 860,
  maxWidth = 1400,
  activeHref,
  label = "Main",
  className,
  ...props
}: ResizableNavbarProps) {
  const [compact, setCompact] = useState(false);
  const [hover, setHover] = useState({ left: 0, width: 0, on: false, moved: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > threshold);
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
    setHover((h) => ({
      left: t.offsetLeft,
      width: t.offsetWidth,
      on: true,
      moved: h.on,
    }));
  };

  const hide = () => setHover((h) => ({ ...h, on: false }));

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
          "relative block rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]",
          isActive
            ? "text-[#0D9488] font-bold"
            : "text-slate-600 hover:text-slate-900",
          inMenu && "rounded-xl px-4 py-2.5 text-sm hover:bg-slate-100"
        )}
      >
        {item.label}
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
        "sticky top-0 z-50 w-full px-3 sm:px-6 transition-all duration-300",
        compact ? "pt-2 sm:pt-3" : "pt-0",
        className
      )}
    >
      <nav
        aria-label={label}
        style={{
          maxWidth: compact ? `${compactWidth}px` : `${maxWidth}px`,
        }}
        className={cn(
          "relative mx-auto flex items-center justify-between gap-4 border transition-all duration-300 ease-out",
          compact
            ? "h-14 rounded-full border-slate-200/90 bg-white/85 px-4 shadow-lg shadow-slate-900/5 backdrop-blur-md"
            : "h-18 sm:h-20 rounded-none border-b border-transparent bg-white/95 px-4 sm:px-6 shadow-xs backdrop-blur-sm"
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
            className="relative"
          >
            {/* Sliding Capsule Indicator */}
            <span
              aria-hidden
              style={{
                transform: `translateX(${hover.left}px)`,
                width: `${hover.width}px`,
                opacity: hover.on ? 1 : 0,
              }}
              className="absolute inset-y-0 left-0 rounded-full bg-slate-100/90 transition-all duration-150 pointer-events-none"
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
            className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-xl backdrop-blur-md lg:hidden"
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
