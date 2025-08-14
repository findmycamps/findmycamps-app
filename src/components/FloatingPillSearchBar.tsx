// components/FloatingPillSearchBar.tsx - Updated with controlled inputs
import React from "react";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import { useStickySearchBar } from "@/hooks/useStickySearchBar";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingPillSearchBarProps {
  onSearch?: (criteria: any) => void;
  redirectOnSearch?: boolean;
  className?: string;
  value?: string; // ✅ NEW: External keyword value
  onValueChange?: (value: string) => void; // ✅ NEW: Callback for typing
}

export const FloatingPillSearchBar: React.FC<FloatingPillSearchBarProps> = ({
  onSearch,
  redirectOnSearch = false,
  className,
  value,
  onValueChange,
}) => {
  const { isSticky } = useStickySearchBar(150);

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        isSticky
          ? "opacity-0 -translate-y-6 scale-95 pointer-events-none"
          : "opacity-100 translate-y-0 scale-100",
        className,
      )}
    >
      <SearchBar
        onSearch={onSearch}
        redirectOnSearch={redirectOnSearch}
        showDropdown={false}
        placeholderText="Search camps, activities..."
        enabledFilters={[]} // No dates in main search bar
        showClearButton={true}
        value={value} // ✅ Pass external value
        onValueChange={onValueChange} // ✅ Pass change handler
      />
    </div>
  );
};

// ✅ UPDATED: Header search bar with controlled input support
export const HeaderSearchBar: React.FC<FloatingPillSearchBarProps> = ({
  onSearch,
  redirectOnSearch = false,
  value, // ✅ NEW: Accept external value
  onValueChange, // ✅ NEW: Accept change handler
}) => {
  const { scrollY } = useStickySearchBar(150);

  // ✅ UPDATED: Use external value if provided
  const [keyword, setKeyword] = React.useState(value || "");

  // ✅ NEW: Sync with external value
  React.useEffect(() => {
    if (value !== undefined) {
      setKeyword(value);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        keyword: keyword,
        location: "ALL",
        dateRange: undefined,
        locationCoords: undefined,
        locationType: "all",
        selectedCategories: undefined,
      });
    }
  };

  // ✅ UPDATED: Handle input changes
  const handleInputChange = (newValue: string) => {
    setKeyword(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // ✅ UPDATED: Clear function
  const handleClear = () => {
    setKeyword("");
    handleInputChange(""); // This will notify parent
    if (onSearch) {
      onSearch({
        keyword: "",
        location: "ALL",
        dateRange: undefined,
        locationCoords: undefined,
        locationType: "all",
        selectedCategories: undefined,
      });
    }
  };

  const opacity = Math.min((scrollY - 100) / 100, 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full transition-all duration-500 ease-out"
      style={{ opacity }}
    >
      <div
        className={cn(
          "relative flex items-center",
          "bg-background/60 dark:bg-background/60", // Same background as your preferred style
          "border border-border/50", // Same border styling
          "backdrop-blur-md backdrop-saturate-150", // Same glassmorphism effect
          "rounded-full", // Same pill shape
          "h-11", // Same compact height
          "px-3 py-1", // Same padding
          "shadow-sm hover:shadow-md transition-shadow", // Same shadow effects
        )}
      >
        {/* Search Icon */}
        <Search className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />

        {/* Compact Input */}
        <input
          type="text"
          placeholder="Search..."
          value={keyword} // ✅ Now synced with external value
          onChange={(e) => handleInputChange(e.target.value)} // ✅ Updated handler
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Clear button when there's text */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground mr-2 p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Compact Search Button - Same styling as your preferred design */}
        <Button
          type="submit"
          size="sm"
          className="h-6 px-3 text-sm rounded-full ml-1" // Same button styling
        >
          Search
        </Button>

        {/* Subtle gradient accent - Same as your preferred design */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      </div>
    </form>
  );
};
