import React, { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { Search, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { PROVINCES } from "../data/constants";
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

export interface SearchCriteria {
  keyword: string;
  location: string;
  date: Date | undefined;
}

interface SearchBarProps {
  onSearch?: (criteria: SearchCriteria) => void; // Made optional for homepage usage
  redirectOnSearch?: boolean; // New prop to control routing behavior
}

function SearchBar({ onSearch, redirectOnSearch = true }: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("ALL");
  const [date, setDate] = useState<Date | undefined>();
  const [activeField, setActiveField] = useState<
    "what" | "where" | "when" | null
  >(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const criteria = { keyword, location, date };

    if (redirectOnSearch) {
      // Redirect to search page with query parameters
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (location !== "ALL") params.set("location", location);
      if (date) params.set("date", date.toISOString());

      router.push(`/search?${params.toString()}`);
    } else if (onSearch) {
      // Call the callback for immediate filtering (used on search page)
      onSearch(criteria);
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Find Your Perfect Camp
          </h2>
          <p className="mt-2 text-muted-foreground">
            Discover amazing camps across Canada.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className={cn(
              "grid grid-cols-1 lg:grid-cols-[2fr_2fr_2.5fr_auto] bg-background shadow-lg transition-all duration-300",
              "rounded-2xl lg:rounded-full border border-border/60 hover:shadow-xl",
              activeField ? "ring-2 ring-primary" : "",
            )}
          >
            {/* Keywords Section */}
            <div className="relative flex items-center border-b lg:border-b-0 lg:border-r border-border/60">
              <div className="p-4 lg:py-3 lg:px-6 w-full">
                <input
                  id="keyword-search"
                  type="text"
                  placeholder="Search camps, activities..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus:outline-none p-0"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="relative flex items-center border-b lg:border-b-0 lg:border-r border-border/60">
              <div className="p-4 lg:py-3 lg:px-6 w-full">
                <Select
                  value={location}
                  onValueChange={setLocation}
                  onOpenChange={(open) => setActiveField(open ? "where" : null)}
                >
                  <SelectTrigger className="w-full bg-transparent border-0 p-0 h-auto justify-start focus:ring-0 focus:ring-offset-0">
                    <SelectValue
                      placeholder="Select a province"
                      className="text-sm font-medium"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Picker Section */}
            <div className="relative flex items-center">
              <Popover
                onOpenChange={(open) => setActiveField(open ? "when" : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="p-4 lg:py-3 lg:px-6 w-full text-left flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {date ? format(date, "LLL d, y") : "Add a date"}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="p-2">
              <Button
                type="submit"
                size="lg"
                className="w-full lg:w-auto lg:h-14 lg:px-6 rounded-xl lg:rounded-full font-bold flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden lg:inline">Search</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
