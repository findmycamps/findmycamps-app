// components/Search/DateFilter.tsx - Alternative approach with manual range handling
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  dateRange?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dateRange,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectingPhase, setSelectingPhase] = useState<
    "start" | "end" | "complete"
  >("start");
  const [tempStart, setTempStart] = useState<Date | undefined>(dateRange?.from);
  const [tempEnd, setTempEnd] = useState<Date | undefined>(dateRange?.to);

  const handleSingleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (selectingPhase === "start" || selectingPhase === "complete") {
      // Selecting start date
      setTempStart(date);
      setTempEnd(undefined);
      setSelectingPhase("end");
      console.log("Start date selected:", date);
      // Don't close calendar, don't call onChange yet
    } else if (selectingPhase === "end") {
      // Selecting end date
      if (tempStart) {
        const startDate = tempStart;
        const endDate = date;

        // Ensure end date is after start date
        if (endDate >= startDate) {
          setTempEnd(endDate);
          setSelectingPhase("complete");

          // Now commit the complete range
          const newRange: DateRange = { from: startDate, to: endDate };
          onChange(newRange);
          setIsOpen(false);
          console.log("Complete range selected:", newRange);
        } else {
          // If end date is before start date, make it the new start date
          setTempStart(date);
          setTempEnd(undefined);
          setSelectingPhase("end");
          console.log("Date before start, making it new start:", date);
        }
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset selection phase when opening
      if (dateRange?.from && dateRange?.to) {
        setSelectingPhase("complete");
      } else {
        setSelectingPhase("start");
      }
    } else {
      // Reset temp values if closing without completing
      setTempStart(dateRange?.from);
      setTempEnd(dateRange?.to);
      setSelectingPhase("start");
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setTempStart(undefined);
    setTempEnd(undefined);
    setSelectingPhase("start");
    setIsOpen(false);
  };

  const getCurrentRange = (): DateRange | undefined => {
    if (tempStart && tempEnd) {
      return { from: tempStart, to: tempEnd };
    } else if (tempStart) {
      return { from: tempStart, to: undefined };
    }
    return undefined;
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select start date...";

    if (dateRange.from && !dateRange.to) {
      return `${dateRange.from.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - Select end date`;
    }

    if (dateRange.to) {
      return `${dateRange.from.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${dateRange.to.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    return dateRange.from.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">Date Range</h3>

      {/* Date Range Picker */}
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground",
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Instruction header */}
          <div className="p-3 border-b bg-muted/20">
            <p className="text-sm font-medium">
              {selectingPhase === "start" && "Step 1: Select start date"}
              {selectingPhase === "end" && "Step 2: Select end date"}
              {selectingPhase === "complete" && "Date range selected"}
            </p>
            {tempStart && selectingPhase === "end" && (
              <p className="text-xs text-muted-foreground">
                Start:{" "}
                {tempStart.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <Calendar
            mode="single" // ✅ Use single mode to manually control range selection
            defaultMonth={dateRange?.from || new Date()}
            selected={
              selectingPhase === "end" && tempStart
                ? tempStart // Show start date as selected while picking end date
                : selectingPhase === "complete" && tempEnd
                  ? tempEnd // Show end date when complete
                  : dateRange?.from // Show committed start date
            }
            onSelect={handleSingleDateSelect}
            numberOfMonths={2}
            disabled={(date) => {
              // Disable past dates
              if (date < new Date()) return true;

              // When selecting end date, disable dates before start date
              if (selectingPhase === "end" && tempStart) {
                return date < tempStart;
              }

              return false;
            }}
            className="rounded-md border-0"
            // Add visual indicators for range
            modifiers={{
              selected: (date) => {
                if (tempStart && tempEnd) {
                  return date >= tempStart && date <= tempEnd;
                }
                return false;
              },
              range_start: tempStart ? [tempStart] : [],
              range_end: tempEnd ? [tempEnd] : [],
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
              range_start: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                borderRadius: "0.375rem 0 0 0.375rem",
              },
              range_end: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                borderRadius: "0 0.375rem 0.375rem 0",
              },
            }}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between p-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>

            <div className="flex gap-2">
              {selectingPhase === "end" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectingPhase("start");
                    setTempStart(undefined);
                    setTempEnd(undefined);
                  }}
                >
                  Restart
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Show selected date range summary */}
      {dateRange?.from && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {dateRange.to ? "Selected Range" : "Start Date Selected"}
              </p>
              <p className="text-xs text-muted-foreground">
                {dateRange.to
                  ? `${dateRange.from.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} - ${dateRange.to.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : `${dateRange.from.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} - Click calendar to select end date`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
              className="text-muted-foreground hover:text-destructive h-auto p-1"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
