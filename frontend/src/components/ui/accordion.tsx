"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string[];
  onValueChange: (itemValue: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const value = controlledValue !== undefined
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalValue;

  const onValueChange = React.useCallback(
    (itemValue: string) => {
      let nextValue: string[];
      if (type === "single") {
        nextValue = value.includes(itemValue) ? [] : [itemValue];
      } else {
        nextValue = value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue];
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }

      if (controlledOnValueChange) {
        controlledOnValueChange(type === "single" ? (nextValue[0] ?? "") : nextValue);
      }
    },
    [type, value, controlledValue, controlledOnValueChange]
  );

  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div className={cn("divide-y divide-slate-200/80", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const AccordionItemContext = React.createContext<{ itemValue: string; isOpen: boolean }>({
  itemValue: "",
  isOpen: false,
});

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  const isOpen = context ? context.value.includes(value) : false;

  return (
    <AccordionItemContext.Provider value={{ itemValue: value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn("border-b border-slate-200/80 transition-colors", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const accordionContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    if (accordionContext && itemContext.itemValue) {
      accordionContext.onValueChange(itemContext.itemValue);
    }
  };

  return (
    <div className="flex">
      <button
        type="button"
        aria-expanded={itemContext.isOpen}
        data-state={itemContext.isOpen ? "open" : "closed"}
        onClick={handleClick}
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between py-5 text-left text-sm font-semibold text-slate-800 transition-all hover:text-[#0D9488] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover/accordion-trigger:text-[#0D9488]",
            itemContext.isOpen && "rotate-180 text-[#0D9488]"
          )}
        />
      </button>
    </div>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const itemContext = React.useContext(AccordionItemContext);

  if (!itemContext.isOpen) {
    return null;
  }

  return (
    <div
      data-state={itemContext.isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden pb-5 text-sm text-slate-600 leading-relaxed animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
