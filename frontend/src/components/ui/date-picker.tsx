"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse existing date or default to year 2000
  const parsedDate = React.useMemo(() => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return null;
  }, [value]);

  const [currentYear, setCurrentYear] = React.useState<number>(
    parsedDate ? parsedDate.getFullYear() : 2000
  );
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    parsedDate ? parsedDate.getMonth() : 0
  );

  React.useEffect(() => {
    if (parsedDate) {
      setCurrentYear(parsedDate.getFullYear());
      setCurrentMonth(parsedDate.getMonth());
    }
  }, [parsedDate]);

  // Generate calendar days for currentMonth & currentYear
  const calendarDays = React.useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; dateStr: string }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, isCurrentMonth: false, dateStr });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, isCurrentMonth: true, dateStr });
    }

    // Next month padding to complete grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, isCurrentMonth: false, dateStr });
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setOpen(false);
  };

  const formattedDisplay = React.useMemo(() => {
    if (!parsedDate) return null;
    const d = parsedDate.getDate();
    const m = MONTH_NAMES[parsedDate.getMonth()];
    const y = parsedDate.getFullYear();
    return `${d} ${m} ${y}`;
  }, [parsedDate]);

  // Year options from 1950 to current year + 2
  const currentActualYear = new Date().getFullYear();
  const yearOptions = React.useMemo(() => {
    const list: number[] = [];
    for (let y = currentActualYear; y >= 1950; y--) {
      list.push(y);
    }
    return list;
  }, [currentActualYear]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#0F172A] shadow-2xs transition-all hover:border-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/25 focus:border-[#0D9488] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[#94A3B8]",
            !value && "text-[#94A3B8]",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 text-[#0D9488] shrink-0" />
            <span className="truncate">{formattedDisplay || placeholder}</span>
          </div>

          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              title="Hapus tanggal"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-72 rounded-2xl border border-[#E2E8F0] bg-white p-3.5 shadow-xl animate-in fade-in-80"
        >
          {/* Header controls: month and year navigation */}
          <div className="flex items-center justify-between gap-1 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-[#0F172A] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#0D9488] cursor-pointer"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-[#0F172A] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#0D9488] cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
              title="Bulan berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAY_NAMES.map((d) => (
              <span key={d} className="text-[10px] font-bold text-[#94A3B8]">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => {
              const isSelected = value === item.dateStr;
              return (
                <button
                  key={`${item.dateStr}-${index}`}
                  type="button"
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={cn(
                    "h-7 w-7 mx-auto flex items-center justify-center rounded-lg text-xs transition-all",
                    item.isCurrentMonth ? "text-[#0F172A]" : "text-slate-300",
                    isSelected
                      ? "bg-[#0D9488] text-white font-bold shadow-xs hover:bg-[#0f766e]"
                      : "hover:bg-emerald-50 hover:text-[#0D9488]"
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer quick actions */}
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const str = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                handleSelectDate(str);
              }}
              className="text-[#0D9488] font-semibold hover:underline"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-medium"
            >
              Batal
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
