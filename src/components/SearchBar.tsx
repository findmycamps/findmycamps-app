// components/SearchBar.tsx - With controlled input support
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Search, MapPin, Navigation, CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORIES_WITH_ICONS } from "@/data/constants";
import { DatePicker } from "@/components/DatePicker";
import { DateRange } from "react-day-picker";

export interface SearchCriteria {
  keyword: string;
  location: string;
  dateRange?: DateRange;
  locationCoords?: { lat: number; lng: number } | null;
  locationType?: "nearby" | "specific" | "all";
  selectedCategories?: string[];
}

interface SearchBarProps {
  // Existing props
  onSearch?: (criteria: SearchCriteria) => void;
  redirectOnSearch?: boolean;

  // Configuration props
  showCategoriesDropdown?: boolean;
  showBadges?: boolean;
  placeholderText?: string;
  enabledFilters?: ("location" | "categories" | "dates")[];
  showDropdown?: boolean;
  floatingMode?: boolean;
  showClearButton?: boolean;

  // Future personalization props
  showFindMyMatchButton?: boolean;
  personalizedSuggestions?: any[];

  // ✅ NEW: Controlled input props
  value?: string; // External keyword value
  onValueChange?: (value: string) => void; // Callback when user types
}

const SUGGESTED_DESTINATIONS = [
  {
    type: "nearby",
    label: "Nearby",
    icon: Navigation,
    value: "NEARBY",
  },
  {
    type: "location",
    label: "Victoria BC",
    icon: MapPin,
    value: "Victoria, BC",
  },
];

function SearchBar({
  onSearch,
  redirectOnSearch = true,
  showCategoriesDropdown = true,
  showBadges = true,
  placeholderText,
  enabledFilters = ["location", "categories", "dates"],
  showDropdown = true,
  floatingMode = false,
  showClearButton = false,
  showFindMyMatchButton = false,
  personalizedSuggestions = [],
  value, // ✅ NEW: External keyword value
  onValueChange, // ✅ NEW: Callback for typing
}: SearchBarProps) {
  const router = useRouter();

  // ✅ UPDATED: Use external value if provided, otherwise internal state
  const [keyword, setKeyword] = useState(value || "");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedLocationLabel, setSelectedLocationLabel] =
    useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<
    "nearby" | "specific" | "all"
  >("all");
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // ✅ NEW: Sync internal keyword with external value
  useEffect(() => {
    if (value !== undefined) {
      setKeyword(value);
    }
  }, [value]);

  // Enhanced click outside handler that ignores DatePicker clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (datePickerRef.current && datePickerRef.current.contains(target)) {
        return;
      }

      const popoverContent = document.querySelector(
        "[data-radix-popper-content-wrapper]",
      );
      if (popoverContent && popoverContent.contains(target)) {
        return;
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    // Only show dropdown if showDropdown is true and not in floating mode
    if (showDropdown && !floatingMode) {
      setIsOpen(true);
      setIsFocused(true);
    } else {
      // Still set focus state for styling but don't open dropdown
      setIsFocused(true);
    }
  };

  // ✅ UPDATED: Handle keyword changes
  const handleKeywordChange = (newValue: string) => {
    setKeyword(newValue);
    if (onValueChange) {
      onValueChange(newValue); // Notify parent of change
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (error) => reject(new Error("Location access denied")),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    });
  };

  const handleSuggestionClick = async (suggestion: any) => {
    if (suggestion.type === "nearby") {
      setSelectedLocation("NEARBY");
      setSelectedLocationLabel("Nearby");
      setLocationType("nearby");
      setIsOpen(false);
      setIsFocused(false);

      setIsGettingLocation(true);
      try {
        const coords = await getCurrentLocation();
        setLocationCoords(coords);
      } catch (error) {
        console.error("Location access denied");
        setLocationCoords(null);
      }
      setIsGettingLocation(false);
    } else {
      setSelectedLocation(suggestion.value);
      setSelectedLocationLabel(suggestion.label);
      setLocationType("specific");
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === "All Categories") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) => {
        if (prev.includes(categoryName)) {
          return prev.filter((cat) => cat !== categoryName);
        } else {
          return [...prev, categoryName];
        }
      });
    }
  };

  // ✅ UPDATED: Clear/reset function
  const handleClear = () => {
    const clearedKeyword = "";
    setKeyword(clearedKeyword);
    setSelectedLocation("");
    setSelectedLocationLabel("");
    setSelectedCategories([]);
    setLocationType("all");
    setLocationCoords(null);
    setSelectedDateRange(undefined);

    if (onValueChange) {
      onValueChange(clearedKeyword);
    }

    // Trigger search with cleared criteria
    if (onSearch) {
      onSearch({
        keyword: clearedKeyword,
        location: "ALL",
        dateRange: undefined,
        locationCoords: undefined,
        locationType: "all",
        selectedCategories: undefined,
      });
    }
  };

  const handleSearch = () => {
    const criteria: SearchCriteria = {
      keyword: keyword,
      location: selectedLocation || "ALL",
      dateRange: selectedDateRange,
      locationCoords: locationCoords,
      locationType: locationType,
      selectedCategories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
    };

    if (redirectOnSearch) {
      const params = new URLSearchParams();
      if (criteria.keyword) params.set("keyword", criteria.keyword);
      if (criteria.location && criteria.location !== "ALL")
        params.set("location", criteria.location);

      if (criteria.dateRange?.from) {
        params.set("dateFrom", criteria.dateRange.from.toISOString());
        if (criteria.dateRange.to) {
          params.set("dateTo", criteria.dateRange.to.toISOString());
        }
      }

      if (criteria.locationCoords) {
        params.set("lat", criteria.locationCoords.lat.toString());
        params.set("lng", criteria.locationCoords.lng.toString());
      }
      if (criteria.locationType)
        params.set("locationType", criteria.locationType);
      if (
        criteria.selectedCategories &&
        criteria.selectedCategories.length > 0
      ) {
        params.set("categories", criteria.selectedCategories.join(","));
      }

      router.push(`/search?${params.toString()}`);
    } else if (onSearch) {
      onSearch(criteria);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setIsFocused(false);
    handleSearch();
  };

  const clearSelections = () => {
    setKeyword("");
    setSelectedLocation("");
    setSelectedLocationLabel("");
    setSelectedCategories([]);
    setLocationType("all");
    setLocationCoords(null);
    setSelectedDateRange(undefined);
  };

  // ✅ UPDATED: Use controlled value for display
  const getDisplayText = () => {
    if (isGettingLocation) return "Getting your location...";

    const parts = [];

    // Use the current keyword (which is now synced)
    if (
      keyword &&
      !selectedCategories.some(
        (cat) => cat.toLowerCase() === keyword.toLowerCase(),
      )
    ) {
      parts.push(keyword);
    }

    if (selectedLocationLabel) {
      parts.push(selectedLocationLabel);
    }

    if (selectedCategories.length > 0) {
      parts.push(...selectedCategories);
    }

    return parts.join(" • ");
  };

  const getPlaceholderText = () => {
    if (isGettingLocation) return "Getting your location...";

    if (placeholderText) return placeholderText;

    if (selectedCategories.length > 0 || selectedLocation) {
      return "Add more criteria or click search...";
    }

    return "Search camps, activities...";
  };

  return (
    <div
      className={cn(
        "relative mx-auto",
        floatingMode ? "max-w-full" : "max-w-3xl mt-8",
      )}
      ref={searchRef}
    >
      {/* Skip badges in floating mode */}
      {!floatingMode &&
        showBadges &&
        (selectedCategories.length > 0 ||
          selectedLocation ||
          selectedDateRange) && (
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {selectedLocation && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                📍 {selectedLocationLabel}
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedLocationLabel("");
                    setLocationType("all");
                    setLocationCoords(null);
                  }}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </div>
            )}

            {selectedCategories.map((category) => (
              <div
                key={category}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center"
              >
                📂 {category}
                <button
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.filter((cat) => cat !== category),
                    )
                  }
                  className="ml-2 text-primary/60 hover:text-primary"
                >
                  ×
                </button>
              </div>
            ))}

            {selectedDateRange?.from && (
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                📅{" "}
                {selectedDateRange.to
                  ? `${selectedDateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${selectedDateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : selectedDateRange.from.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                <button
                  onClick={() => setSelectedDateRange(undefined)}
                  className="ml-2 text-green-400 hover:text-green-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            floatingMode
              ? "bg-transparent rounded-full border-0 shadow-none"
              : "bg-white rounded-full shadow-lg border",
            !floatingMode && isFocused
              ? "shadow-2xl scale-[1.02] border-primary/20"
              : !floatingMode && "shadow-md hover:shadow-lg border-gray-200",
          )}
        >
          <div
            className={cn("flex items-center", floatingMode ? "p-1" : "p-2")}
          >
            <div className="flex-1 relative">
              <div
                className={cn(
                  "absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400",
                  floatingMode && "left-4",
                )}
              >
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder={getPlaceholderText()}
                value={getDisplayText()}
                onChange={(e) => {
                  handleKeywordChange(e.target.value); // ✅ UPDATED: Use new handler
                }}
                onFocus={handleInputFocus}
                disabled={isGettingLocation}
                className={cn(
                  "w-full py-4 text-base font-medium placeholder:text-gray-400 bg-transparent focus:outline-none disabled:opacity-50",
                  floatingMode
                    ? "pl-12 pr-4 rounded-full"
                    : "pl-12 pr-4 rounded-l-full",
                )}
              />

              {(selectedCategories.length > 0 ||
                selectedLocation ||
                selectedDateRange) &&
                !floatingMode && (
                  <button
                    type="button"
                    onClick={clearSelections}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
            </div>

            {/* Only show date picker if dates are in enabledFilters */}
            {enabledFilters.includes("dates") && (
              <div
                ref={datePickerRef}
                className={cn(
                  "flex items-center pl-4",
                  !floatingMode && "border-l border-gray-200",
                )}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <DatePicker
                  dateRange={selectedDateRange}
                  onSelect={setSelectedDateRange}
                  placeholder="When?"
                  className="border-0 bg-transparent shadow-none hover:bg-gray-50 rounded-full"
                />
              </div>
            )}

            <div
              className={cn(
                "flex items-center gap-2",
                floatingMode ? "ml-2" : "ml-2",
              )}
            >
              {/* Clear button */}
              {showClearButton &&
                (keyword ||
                  selectedLocation ||
                  selectedCategories.length > 0) && (
                  <Button
                    type="button"
                    variant="outline"
                    size={floatingMode ? "sm" : "lg"}
                    onClick={handleClear}
                    className={cn(
                      "text-muted-foreground hover:text-foreground rounded-full transition-all duration-200",
                      floatingMode ? "h-10 px-3" : "h-12 px-4",
                    )}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {!floatingMode && (
                      <span className="hidden sm:inline">Clear</span>
                    )}
                  </Button>
                )}

              <Button
                type="submit"
                size={floatingMode ? "sm" : "lg"}
                disabled={isGettingLocation}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105",
                  floatingMode ? "h-10 px-4" : "h-12 px-6",
                )}
              >
                <Search className={cn("w-4 h-4", !floatingMode && "md:mr-2")} />
                {!floatingMode && (
                  <span className="hidden md:inline">
                    {isGettingLocation ? "Locating..." : "Search"}
                  </span>
                )}
              </Button>

              {showFindMyMatchButton && !floatingMode && (
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  className="h-12 px-6 font-semibold rounded-full transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    console.log("Find My Match clicked");
                  }}
                >
                  <span className="hidden md:inline">Find My Match</span>
                  <span className="md:hidden">Match</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Only show dropdown if not in floating mode */}
      {!floatingMode && showDropdown && isOpen && !isGettingLocation && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg z-40 max-h-96 overflow-y-auto">
          <div className="p-6">
            {enabledFilters.includes("location") && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Suggested destinations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {SUGGESTED_DESTINATIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "p-4 hover:bg-gray-50 rounded-lg transition-colors text-center group",
                        selectedLocation === suggestion.value &&
                          "bg-blue-50 border border-blue-200",
                      )}
                    >
                      <suggestion.icon className="w-7 h-7 mx-auto mb-2 text-gray-600 group-hover:text-primary" />
                      <div className="text-md font-medium group-hover:text-primary">
                        {suggestion.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showCategoriesDropdown &&
              enabledFilters.includes("categories") && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Explore by category
                    </h3>
                    {selectedCategories.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {selectedCategories.length} selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategories([])}
                          className="text-sm text-gray-500 hover:text-gray-700 h-auto py-1 px-2"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {CATEGORIES_WITH_ICONS.slice(0, 14).map(
                      (category, index) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategories.includes(
                          category.name,
                        );
                        return (
                          <button
                            key={index}
                            onClick={() => handleCategoryClick(category.name)}
                            className={cn(
                              "flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-center group relative",
                              isSelected &&
                                "bg-primary/10 border border-primary/20",
                            )}
                          >
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                ✓
                              </div>
                            )}
                            <div
                              className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-lg mb-2 group-hover:scale-105 transition-transform",
                                category.bgColor,
                              )}
                            >
                              <Icon className={cn("w-6 h-6", category.color)} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                              {category.name}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
