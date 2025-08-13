// components/DatePicker.tsx (Complete Enhanced Version)

"use client";

import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { format, isValid, parseISO, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  dateRange?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from(
  { length: Math.min(7, 2027 - currentYear) },
  (_, i) => currentYear + i,
);

export function DatePicker({
  dateRange,
  onSelect,
  placeholder = "Pick date range",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"calendar" | "month">(
    "calendar",
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    dateRange?.from || new Date(),
  );

  const maxDate = new Date(2026, 11, 31);
  const minDate = new Date();

  const handleMonthSelect = (monthIndex: number, year: number) => {
    if (year >= 2027) return;

    const newDate = new Date(year, monthIndex, 1);
    setCurrentMonth(newDate);
    setViewMode("calendar");
  };

  // ✅ ENHANCED VERSION: Better UX for range selection
  const handleDateRangeSelect = (selectedRange: DateRange | undefined) => {
    // Handle the selection logic
    if (!selectedRange?.from) {
      // Clearing selection
      onSelect(undefined);
      return;
    }

    if (!dateRange?.from || (dateRange?.from && dateRange?.to)) {
      // Starting new selection - clear any existing range
      onSelect({ from: selectedRange.from, to: undefined });
    } else if (dateRange?.from && !dateRange?.to) {
      // Completing the range
      onSelect(selectedRange);
      // Close popover after completing range
      if (selectedRange?.to) {
        setTimeout(() => setIsOpen(false), 100); // Small delay for visual feedback
      }
    }
  };

  // ✅ MAKE SURE THIS FUNCTION IS INCLUDED
  const toggleView = () => {
    setViewMode(viewMode === "calendar" ? "month" : "calendar");
  };

  const getDateRangeText = () => {
    if (!dateRange?.from) return placeholder;

    if (dateRange.to) {
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    } else {
      return `${format(dateRange.from, "MMM d")} - ?`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground",
            dateRange?.from && !dateRange?.to && "text-primary",
            className,
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {getDateRangeText()}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={toggleView}
              className="text-sm font-medium"
            >
              {viewMode === "calendar" ? "Choose Month" : "Calendar View"}
            </Button>
            {viewMode === "calendar" && (
              <div className="flex items-center gap-2">
                {dateRange?.from && !dateRange?.to && (
                  <span className="text-xs text-primary">Select end date</span>
                )}
                <div className="text-sm font-medium">
                  {format(currentMonth, "MMMM yyyy")}
                </div>
              </div>
            )}
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="p-3">
            {dateRange?.from && !dateRange?.to && (
              <div className="mb-3 p-2 bg-primary/10 rounded-lg text-center">
                <p className="text-xs text-primary font-medium">
                  Selected: {format(dateRange.from, "MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click another date to complete your range
                </p>
              </div>
            )}

            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              numberOfMonths={2}
              disabled={(date) => date < minDate || date > maxDate}
              initialFocus
              className="border-0"
            />

            <div className="flex justify-between mt-3 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelect(undefined);
                  setIsOpen(false);
                }}
              >
                Clear
              </Button>

              {dateRange?.from && dateRange?.to && (
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="bg-primary text-primary-foreground"
                >
                  Apply Range
                </Button>
              )}
            </div>
          </div>
        ) : (
          <MonthYearSelector
            currentDate={currentMonth}
            onSelect={handleMonthSelect}
            maxYear={2026}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

interface MonthYearSelectorProps {
  currentDate: Date;
  onSelect: (month: number, year: number) => void;
  maxYear: number;
}

function MonthYearSelector({
  currentDate,
  onSelect,
  maxYear,
}: MonthYearSelectorProps) {
  const [selectedYear, setSelectedYear] = React.useState(
    currentDate.getFullYear(),
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.filter((year) => year <= maxYear).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => {
          const isDisabled = selectedYear >= 2027;

          return (
            <Button
              key={month}
              variant={
                currentDate.getMonth() === index &&
                currentDate.getFullYear() === selectedYear
                  ? "default"
                  : "ghost"
              }
              onClick={() => onSelect(index, selectedYear)}
              disabled={isDisabled}
              className="h-10 text-sm"
            >
              {month.slice(0, 3)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
