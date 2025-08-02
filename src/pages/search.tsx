import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  Map,
  MapPinOff,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CampCard from "@/components/CampCard";
import CampMap from "@/components/CampMap";
import CampProfilePage from "@/components/CampProfilePage";
import { useCamps } from "@/hooks/useCamps";
import { groupCamps, type GroupedCamp } from "@/utils/campUtils";
import { CATEGORIES_WITH_ICONS } from "@/data/constants";
import type { SearchCriteria } from "@/components/SearchBar";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  ageGroups: string[];
  tags: string[];
}

const AGE_GROUPS = [
  "4-6 years",
  "7-9 years",
  "10-13 years",
  "14-17 years",
  "18+ years",
];

const PRICE_RANGES = [
  { label: "Any Price", value: "0-1000", range: [0, 1000] as [number, number] },
  { label: "Under $200", value: "0-200", range: [0, 200] as [number, number] },
  {
    label: "$200 - $400",
    value: "200-400",
    range: [200, 400] as [number, number],
  },
  {
    label: "$400 - $600",
    value: "400-600",
    range: [400, 600] as [number, number],
  },
  {
    label: "$600 - $800",
    value: "600-800",
    range: [600, 800] as [number, number],
  },
  { label: "$800+", value: "800-1000", range: [800, 1000] as [number, number] },
];

// Helper functions
const extractAgeRange = (
  ageString: string,
): { min: number; max: number } | null => {
  const cleaned = ageString
    .toLowerCase()
    .replace(/years?/g, "")
    .trim();

  if (cleaned.includes("+")) {
    const minAge = parseInt(cleaned.replace("+", ""));
    return { min: minAge, max: 100 };
  }

  if (cleaned.includes("-")) {
    const parts = cleaned.split("-");
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max };
    }
  }

  const singleAge = parseInt(cleaned);
  if (!isNaN(singleAge)) {
    return { min: singleAge, max: singleAge };
  }

  return null;
};

const ageRangesOverlap = (
  range1: { min: number; max: number },
  range2: { min: number; max: number },
): boolean => {
  return range1.min <= range2.max && range2.min <= range1.max;
};

// ✅ ENHANCED: Back to Top Button with placeholder text
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {/* ✅ NEW: Container for button and text */}
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={scrollToTop}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        {/* ✅ NEW: Placeholder text under the button */}
        <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border shadow-sm">
          Back to Top
        </span>
      </div>
    </div>
  );
};

// List view component for camp results
const CampListItem = ({
  camp,
  onClick,
}: {
  camp: GroupedCamp;
  onClick: () => void;
}) => {
  const CampThumbnail = ({ camp }: { camp: GroupedCamp }) => {
    const categoryInfo = CATEGORIES_WITH_ICONS.find(
      (c) => c.name.toLowerCase() === camp.category?.toLowerCase(),
    );
    const Icon = categoryInfo?.icon || Sparkles;
    const bgColor = categoryInfo?.bgColor || "bg-muted";

    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-l-lg ${bgColor}`}
      >
        <Icon className="h-12 w-12 text-foreground/50" />
      </div>
    );
  };

  const firstSession = camp.sessions?.[0];

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex min-h-[160px]">
          <div className="w-48 flex-shrink-0 overflow-hidden">
            {camp.image ? (
              <img
                src={camp.image}
                alt={camp.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            ) : (
              <CampThumbnail camp={camp} />
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-semibold mb-1">{camp.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {camp.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-primary">
                    ${firstSession?.price || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /week
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{camp.ageRange}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {firstSession?.location?.city || "N/A"},{" "}
                    {firstSession?.location?.province || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {firstSession?.dates
                      ? `${new Date(firstSession.dates.startDate).toLocaleDateString()} - ${new Date(firstSession.dates.endDate).toLocaleDateString()}`
                      : "No dates available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {camp.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {camp.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{camp.tags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SearchPage() {
  const router = useRouter();
  const { camps: allCamps, loading, error } = useCamps();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<GroupedCamp | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    keyword: "",
    location: "ALL",
    date: undefined,
  });

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    ageGroups: [],
    tags: [],
  });

  const [filteredCamps, setFilteredCamps] = useState<GroupedCamp[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showMap, setShowMap] = useState(false);

  // Sidebar state for desktop collapsible behavior
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Initialize search from URL parameters
  useEffect(() => {
    if (router.isReady) {
      const { keyword, location, date } = router.query;
      setSearchCriteria({
        keyword: (keyword as string) || "",
        location: (location as string) || "ALL",
        date: date ? new Date(date as string) : undefined,
      });
    }
  }, [router.isReady, router.query]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Main filtering logic
  useEffect(() => {
    if (loading || !allCamps.length) return;

    let filtered = [...allCamps];

    if (searchCriteria.keyword) {
      const keyword = searchCriteria.keyword.toLowerCase();
      filtered = filtered.filter(
        (camp) =>
          camp.name.toLowerCase().includes(keyword) ||
          camp.description.toLowerCase().includes(keyword) ||
          camp.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    if (searchCriteria.location !== "ALL") {
      filtered = filtered.filter(
        (camp) => camp.location.province === searchCriteria.location,
      );
    }

    if (searchCriteria.date) {
      const selectedDate = new Date(searchCriteria.date);
      selectedDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((camp) => {
        const startDate = new Date(camp.dates.startDate);
        const endDate = new Date(camp.dates.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return selectedDate >= startDate && selectedDate <= endDate;
      });
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((camp) =>
        filters.categories.includes(camp.category),
      );
    }

    filtered = filtered.filter((camp) => {
      const campPrice = camp.price || 0;
      return (
        campPrice >= filters.priceRange[0] && campPrice <= filters.priceRange[1]
      );
    });

    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter((camp) => {
        const campAgeRange = extractAgeRange(camp.ageRange);
        if (!campAgeRange) return false;

        return filters.ageGroups.some((selectedAgeGroup) => {
          const selectedRange = extractAgeRange(selectedAgeGroup);
          if (!selectedRange) return false;
          return ageRangesOverlap(campAgeRange, selectedRange);
        });
      });
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((camp) =>
        filters.tags.some((tag) => camp.tags.includes(tag)),
      );
    }

    setFilteredCamps(groupCamps(filtered));
  }, [allCamps, searchCriteria, filters, loading]);

  const allTags = Array.from(
    new Set(allCamps.flatMap((camp) => camp.tags)),
  ).slice(0, 10);

  // Filter handlers
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      ageGroups: checked
        ? [...prev.ageGroups, ageGroup]
        : prev.ageGroups.filter((a) => a !== ageGroup),
    }));
  };

  const handlePriceRangeChange = (value: string) => {
    const selectedRange = PRICE_RANGES.find((range) => range.value === value);
    if (selectedRange) {
      setFilters((prev) => ({ ...prev, priceRange: selectedRange.range }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      ageGroups: [],
      tags: [],
    });
  };

  if (loading) return <div className="p-8">Loading camps...</div>;
  if (error) return <div className="p-8">Error loading camps.</div>;

  if (selectedCamp) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <CampProfilePage
          camp={selectedCamp}
          onBack={() => setSelectedCamp(null)}
        />
      </div>
    );
  }

  // Filters Panel Component
  const FiltersPanel = () => (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES_WITH_ICONS.filter(
            (cat) => cat.name !== "All Categories",
          ).map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <Checkbox
                id={category.name}
                checked={filters.categories.includes(category.name)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.name, checked as boolean)
                }
              />
              <Label htmlFor={category.name} className="text-sm font-medium">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Price Range with shadcn Select */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Select
          value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
          onValueChange={handlePriceRangeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGES.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-8" />

      {/* Age Groups Filter */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Age Groups</h3>
        <div className="space-y-3">
          {AGE_GROUPS.map((ageGroup) => (
            <div key={ageGroup} className="flex items-center space-x-2">
              <Checkbox
                id={ageGroup}
                checked={filters.ageGroups.includes(ageGroup)}
                onCheckedChange={(checked) =>
                  handleAgeGroupChange(ageGroup, checked as boolean)
                }
              />
              <Label htmlFor={ageGroup} className="text-sm font-medium">
                {ageGroup}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Popular Activities with Badge Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Popular Activities</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "secondary"}
              className={`cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground text-xs ${
                filters.tags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="bg-background text-foreground min-h-screen">
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

        <SearchBar onSearch={setSearchCriteria} redirectOnSearch={false} />

        <div className="flex">
          {/* Desktop Filters Sidebar */}
          <div
            className={`hidden lg:block transition-all duration-300 ${
              sidebarCollapsed ? "w-16" : "w-[350px]"
            } bg-background border-r border-border relative`}
          >
            {/* Make the sidebar content sticky */}
            <div className="sticky top-0 h-screen">
              {/* Sidebar Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full border border-border bg-background shadow-sm"
              >
                {sidebarCollapsed ? ">" : "<"}
              </Button>

              {/* Sidebar Content */}
              <div
                className={`transition-opacity duration-300 ${sidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"} h-full`}
              >
                {!sidebarCollapsed && <FiltersPanel />}
              </div>

              {/* Collapsed State with improved tooltip */}
              {sidebarCollapsed && (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarCollapsed(false)}
                      className="w-10 h-10 relative group"
                      title="Open Filters"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      {/* Active filter indicator */}
                      {(filters.categories.length +
                        filters.ageGroups.length +
                        filters.tags.length >
                        0 ||
                        filters.priceRange[0] !== 0 ||
                        filters.priceRange[1] !== 1000) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border border-background"></div>
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground text-center px-1">
                      Click for Filters
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div
            className={`flex-1 min-w-0 p-4 transition-all duration-300 ${showMap ? "" : "pr-8"}`}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {searchCriteria.keyword
                      ? `Results for "${searchCriteria.keyword}"`
                      : "All Camps"}
                  </h1>
                  <p className="text-muted-foreground">
                    {filteredCamps.length} camps found
                  </p>
                </div>

                {/* Desktop Control Panel */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex items-center gap-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      Grid
                    </Button>
                  </div>

                  <div className="border-l border-border pl-3">
                    <Button
                      variant={showMap ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center gap-2"
                    >
                      {showMap ? (
                        <>
                          <MapPinOff className="w-4 h-4" />
                          Hide Map
                        </>
                      ) : (
                        <>
                          <Map className="w-4 h-4" />
                          Show Map
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile Control Panel */}
                <div className="lg:hidden flex items-center gap-2">
                  {/* ✅ FIXED: Sheet with SheetTrigger properly nested */}
                  <Sheet
                    open={mobileFiltersOpen}
                    onOpenChange={setMobileFiltersOpen}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        {filters.categories.length +
                          filters.ageGroups.length +
                          filters.tags.length >
                          0 && (
                          <Badge
                            variant="destructive"
                            className="ml-1 h-5 w-5 p-0 text-xs"
                          >
                            {filters.categories.length +
                              filters.ageGroups.length +
                              filters.tags.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="px-6 py-4 border-b">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <FiltersPanel />
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={showMap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.categories.length > 0 ||
                filters.ageGroups.length > 0 ||
                filters.tags.length > 0 ||
                filters.priceRange[0] !== 0 ||
                filters.priceRange[1] !== 1000) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryChange(category, false)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {filters.ageGroups.map((age) => (
                    <Badge
                      key={age}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {age}
                      <button
                        onClick={() => handleAgeGroupChange(age, false)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {(filters.priceRange[0] !== 0 ||
                    filters.priceRange[1] !== 1000) && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      ${filters.priceRange[0]} - $
                      {filters.priceRange[1] === 1000
                        ? "1000+"
                        : filters.priceRange[1]}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: [0, 1000],
                          }))
                        }
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Results Layout */}
            {viewMode === "list" ? (
              <div className="space-y-4">
                {filteredCamps.map((camp, index) => (
                  <CampListItem
                    key={index}
                    camp={camp}
                    onClick={() => setSelectedCamp(camp)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredCamps.map((camp, index) => (
                  <CampCard
                    key={index}
                    camp={camp}
                    onClick={() => setSelectedCamp(camp)}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredCamps.length === 0 && (
              <Card className="p-12 text-center">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">No camps found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to see more
                    results.
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Conditional Google Maps Panel */}
          {showMap && (
            <div className="hidden xl:block w-[500px] border-l border-border">
              <div className="h-screen sticky top-0">
                <CampMap
                  camps={filteredCamps}
                  selectedCamp={selectedCamp}
                  onCampSelect={(camp) => setSelectedCamp(camp)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Back to Top Button */}
        <BackToTopButton />
      </main>
    </div>
  );
}
