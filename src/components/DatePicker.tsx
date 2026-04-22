"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string;           // "YYYY-MM-DD"
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function parseDate(val: string): Date | null {
  if (!val) return null;
  const d = new Date(val + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(val: string): string {
  const d = parseDate(val);
  if (!d) return "";
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DatePicker({ value, onChange, placeholder = "Select date", required }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = parseDate(value);
  const initial = selected ?? today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync view when value changes externally
  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const selectDay = (day: number) => {
    const iso = toISO(viewYear, viewMonth, day);
    onChange(iso);
    setOpen(false);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < today;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  };

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  return (
    <div ref={ref} className="relative">
      {/* Hidden native input for form validation */}
      <input
        type="hidden"
        value={value}
        required={required}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 bg-black border rounded-lg px-3 py-2.5 text-sm text-left transition-colors focus:outline-none ${
          open ? "border-lime-500" : "border-white/20 hover:border-white/40"
        }`}
      >
        <Calendar size={15} className={value ? "text-lime-500" : "text-gray-500"} />
        <span className={value ? "text-white flex-1" : "text-gray-500 flex-1"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <ChevronRight
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-72 bg-gray-900 border border-lime-500/30 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">

          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white text-sm font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-500 pb-1">{d}</div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const past = isPast(day);
              const sel = isSelected(day);
              const tod = isToday(day);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  onClick={() => selectDay(day)}
                  className={`
                    w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                    ${sel
                      ? "bg-lime-500 text-black font-bold"
                      : past
                      ? "text-gray-700 cursor-not-allowed"
                      : tod
                      ? "text-lime-400 border border-lime-500/40 hover:bg-lime-500/20"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="border-t border-white/10 px-4 py-2.5 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                const iso = toISO(today.getFullYear(), today.getMonth(), today.getDate());
                onChange(iso);
                setOpen(false);
              }}
              className="text-xs text-lime-400 hover:text-lime-300 font-medium transition-colors"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
