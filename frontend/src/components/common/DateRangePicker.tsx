"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChange: (startDate: string, endDate: string) => void;
  onClear?: () => void;
  className?: string;
  placeholder?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onClear,
  className = "",
  placeholder = "Chọn khoảng thời gian...",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view month/year
  const getInitialDate = () => {
    if (startDate) {
      const [y, m, d] = startDate.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  const [viewDate, setViewDate] = useState<Date>(getInitialDate);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [tempStart, setTempStart] = useState<string | null>(startDate || null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Sync tempStart when startDate changes from outside
  useEffect(() => {
    setTempStart(startDate || null);
    if (startDate) {
      const [y, m, d] = startDate.split("-").map(Number);
      setViewDate(new Date(y, m - 1, d));
    }
  }, [startDate]);

  // Format YYYY-MM-DD helper using local numbers
  const toYmd = (year: number, monthIndex: number, day: number) => {
    const m = String(monthIndex + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Format D/M/YYYY display (e.g. 28/9/2026)
  const formatDisplayDate = (ymd: string) => {
    if (!ymd) return "";
    const [y, m, d] = ymd.split("-");
    return `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0 - 11

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar days generation (Monday first: T2, T3, T4, T5, T6, T7, CN)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Monday is 1, Sunday is 0 -> offset for Monday first
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const handleDayClick = (day: number) => {
    const clickedYmd = toYmd(currentYear, currentMonth, day);

    if (!tempStart || (tempStart && endDate)) {
      // First click: sets start date
      setTempStart(clickedYmd);
      onChange(clickedYmd, "");
    } else {
      // Second click: sets end date
      if (clickedYmd < tempStart) {
        onChange(clickedYmd, tempStart);
        setTempStart(clickedYmd);
      } else {
        onChange(tempStart, clickedYmd);
      }
      setIsOpen(false);
    }
  };

  // Quick preset helpers
  const handleQuickPreset = (preset: "today" | "7days" | "30days" | "month") => {
    const now = new Date();
    const todayYmd = toYmd(now.getFullYear(), now.getMonth(), now.getDate());

    if (preset === "today") {
      onChange(todayYmd, todayYmd);
    } else if (preset === "7days") {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      onChange(
        toYmd(past.getFullYear(), past.getMonth(), past.getDate()),
        todayYmd
      );
    } else if (preset === "30days") {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      onChange(
        toYmd(past.getFullYear(), past.getMonth(), past.getDate()),
        todayYmd
      );
    } else if (preset === "month") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      onChange(
        toYmd(first.getFullYear(), first.getMonth(), 1),
        toYmd(last.getFullYear(), last.getMonth(), last.getDate())
      );
    }
    setIsOpen(false);
  };

  const effectiveEnd =
    endDate || (tempStart && hoverDate && !endDate ? hoverDate : "");
  const sortedRange =
    tempStart && effectiveEnd
      ? tempStart <= effectiveEnd
        ? [tempStart, effectiveEnd]
        : [effectiveEnd, tempStart]
      : null;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* 1. INPUT TRIGGER BOX (matches user screenshot 1 exactly) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 hover:border-blue-500/80 shadow-xs cursor-pointer transition-all select-none min-w-[260px] sm:min-w-[280px]"
      >
        <div className="flex items-center gap-3">
          {/* Calendar icon inside soft rounded square badge */}
          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-700/80 flex items-center justify-center text-gray-700 dark:text-gray-200 text-sm shadow-2xs flex-shrink-0">
            <svg
              className="w-4 h-4 text-gray-700 dark:text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="8" cy="14" r="0.8" fill="currentColor" />
              <circle cx="12" cy="14" r="0.8" fill="currentColor" />
              <circle cx="16" cy="14" r="0.8" fill="currentColor" />
              <circle cx="8" cy="18" r="0.8" fill="currentColor" />
              <circle cx="12" cy="18" r="0.8" fill="currentColor" />
              <circle cx="16" cy="18" r="0.8" fill="currentColor" />
            </svg>
          </div>

          {/* Date range text */}
          <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-normal">
            {startDate && endDate ? (
              `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`
            ) : startDate ? (
              `${formatDisplayDate(startDate)} – Chọn ngày kết thúc...`
            ) : (
              <span className="text-gray-400 font-normal">{placeholder}</span>
            )}
          </span>
        </div>

        {/* Right Calendar Icon & Clear Button */}
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          {(startDate || endDate) && onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                setTempStart(null);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-red-500 transition-colors text-xs"
              title="Xóa bộ lọc ngày"
            >
              ✕
            </button>
          )}

          {/* Calendar outline icon with bottom-right filled square (matching screenshot 1) */}
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect
              x="14"
              y="14"
              width="3.5"
              height="3.5"
              fill="currentColor"
              stroke="none"
              rx="0.5"
            />
          </svg>
        </div>
      </div>

      {/* 2. CALENDAR DROPDOWN (matches user screenshot 2 exactly) */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Header: Month Year + Prev/Next Arrows */}
          <div className="flex items-center justify-between pb-3">
            {/* Month-Year selector badge */}
            <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center gap-1.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              <span>
                THG {currentMonth + 1} {currentYear}
              </span>
              <svg
                className="w-3.5 h-3.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all"
                title="Tháng trước"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all"
                title="Tháng sau"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800"></div>

          {/* Month Subtitle (matches 'THÁNG 9' in screenshot 2) */}
          <div className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-3 pb-1 px-1">
            THÁNG {currentMonth + 1}
          </div>

          {/* Weekday Labels: T2, T3, T4, T5, T6, T7, CN */}
          <div className="grid grid-cols-7 text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div>T2</div>
            <div>T3</div>
            <div>T4</div>
            <div>T5</div>
            <div>T6</div>
            <div>T7</div>
            <div>CN</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {/* Empty Offset Cells */}
            {Array.from({ length: offset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-9"></div>
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const ymd = toYmd(currentYear, currentMonth, day);

              const isStart = sortedRange && sortedRange[0] === ymd;
              const isEnd = sortedRange && sortedRange[1] === ymd;
              const isInRange =
                sortedRange && ymd > sortedRange[0] && ymd < sortedRange[1];

              const hasRange =
                sortedRange && sortedRange[0] !== sortedRange[1];

              return (
                <div
                  key={ymd}
                  onMouseEnter={() => setHoverDate(ymd)}
                  onClick={() => handleDayClick(day)}
                  className={`h-9 flex items-center justify-center relative cursor-pointer select-none ${
                    isInRange
                      ? "bg-[#dbe4f6] dark:bg-blue-900/50"
                      : isStart && hasRange
                      ? "bg-gradient-to-r from-transparent 50% to-[#dbe4f6] dark:to-blue-900/50 50%"
                      : isEnd && hasRange
                      ? "bg-gradient-to-l from-transparent 50% to-[#dbe4f6] dark:to-blue-900/50 50%"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all relative z-10 ${
                      isStart || isEnd
                        ? "bg-[#3e56bc] dark:bg-blue-600 text-white shadow-xs"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Presets Bar */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-1 text-[11px]">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickPreset("today")}
                className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("7days")}
                className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                7 ngày
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("month")}
                className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                Tháng này
              </button>
            </div>

            {onClear && (startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setTempStart(null);
                  setIsOpen(false);
                }}
                className="text-red-500 hover:underline font-semibold px-1 text-xs"
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
