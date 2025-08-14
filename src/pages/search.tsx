// pages/search.tsx - With keyword state management and controlled inputs
import React, { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CampMap from "@/components/CampMap";
import CampProfilePage from "@/components/CampProfilePage";
import { SearchLayout } from "@/components/Search/SearchLayout";
import { ResultsHeader } from "@/components/Search/ResultsHeader";
import { CampResults } from "@/components/Search/CampResults";
import { BackToTopButton } from "@/components/Search/BackToTopButton";
import { DateFilter } from "@/components/Search/DateFilter";
import { CategoriesFilter } from "@/components/Search/CategoriesFilter";
import { PriceRangeFilter } from "@/components/Search/PriceRangeFilter";
import { AgeGroupsFilter } from "@/components/Search/AgeGroupsFilter";
import { TagsFilter } from "@/components/Search/TagsFilter";
import {
  FloatingPillSearchBar,
  HeaderSearchBar,
} from "@/components/FloatingPillSearchBar";
import { useSearchPage } from "@/hooks/useSearchPage";
import { useStickySearchBar } from "@/hooks/useStickySearchBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { GroupedCamp } from "@/utils/campUtils";

export default function SearchPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<GroupedCamp | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showMap, setShowMap] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Sticky header search bar
  const { isSticky } = useStickySearchBar(150);

  // All search logic from custom hook
  const {
    searchCriteria,
    filters,
    filteredCamps,
    userLocation,
    allTags,
    loading,
    error,
    setSearchCriteria,
    handleSearchBarSelection,
    handleCategoryChange,
    handlePriceRangeChange,
    handleAgeGroupChange,
    handleTagToggle,
    clearAllFilters,
  } = useSearchPage();

  // ✅ NEW: Handle keyword changes from search bars
  const handleKeywordChange = (newKeyword: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      keyword: newKeyword,
    }));
  };

  // ✅ UPDATED: Enhanced search bar selection handler
  const handleEnhancedSearchBarSelection = (criteria: any) => {
    handleSearchBarSelection(criteria);
    // Also update the keyword state to keep inputs synced
    setSearchCriteria((prev) => ({
      ...prev,
      keyword: criteria.keyword,
    }));
  };

  // Dark mode effect
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Calculate active filters count for mobile badge
  React.useEffect(() => {
    const count =
      filters.categories.length +
      filters.ageGroups.length +
      filters.tags.length +
      (searchCriteria.selectedCategories?.length || 0) +
      (searchCriteria.dateRange?.from ? 1 : 0); // Include date range in count
    setActiveFiltersCount(count);
  }, [filters, searchCriteria.selectedCategories, searchCriteria.dateRange]);

  // Loading and error states
  if (loading) return <div className="p-8">Loading camps...</div>;
  if (error) return <div className="p-8">Error loading camps.</div>;

  // Camp profile view
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

  // Calculate if we have active filters for UI indicators
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.ageGroups.length > 0 ||
    filters.tags.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 1000 ||
    Boolean(searchCriteria.dateRange?.from); // ✅ Convert to boolean

  // ✅ UPDATED: Enhanced clear all function
  const handleClearAll = () => {
    // Clear filters
    clearAllFilters();

    // Clear search criteria including dates
    setSearchCriteria((prev) => ({
      ...prev,
      keyword: "",
      location: "ALL",
      dateRange: undefined,
      locationCoords: undefined,
      locationType: "all",
      selectedCategories: undefined,
    }));
  };

  // Filters Panel Component
  const FiltersPanel = () => (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      {/* Date filter now in sidebar */}
      <DateFilter
        dateRange={searchCriteria.dateRange}
        onChange={(dateRange) =>
          setSearchCriteria((prev) => ({ ...prev, dateRange }))
        }
      />

      <Separator className="mb-8" />

      <CategoriesFilter
        selectedCategories={searchCriteria.selectedCategories}
        filterCategories={filters.categories}
        onCategoryChange={handleCategoryChange}
      />

      <Separator className="mb-8" />

      <PriceRangeFilter
        priceRange={filters.priceRange}
        onChange={handlePriceRangeChange}
      />

      <Separator className="mb-8" />

      <AgeGroupsFilter
        ageGroups={filters.ageGroups}
        onAgeGroupChange={handleAgeGroupChange}
      />

      <Separator className="mb-8" />

      <TagsFilter
        tags={filters.tags}
        allTags={allTags}
        onTagToggle={handleTagToggle}
      />
    </div>
  );

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="bg-background text-foreground min-h-screen">
        {/* Header with integrated search bar */}
        <Header
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isDarkMode={isDarkMode}
          showStickySearchBar={isSticky}
          stickySearchBar={
            <HeaderSearchBar
              onSearch={handleEnhancedSearchBarSelection}
              redirectOnSearch={false}
              value={searchCriteria.keyword} // ✅ Pass current keyword
              onValueChange={handleKeywordChange} // ✅ Handle keyword changes
            />
          }
        />

        {/* ✅ UPDATED: Main SearchBar with controlled input */}
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isSticky
              ? "opacity-0 -translate-y-6 scale-95 pointer-events-none"
              : "opacity-100 translate-y-0 scale-100",
          )}
        >
          <SearchBar
            onSearch={handleEnhancedSearchBarSelection}
            redirectOnSearch={false}
            showDropdown={false}
            placeholderText="Search camps, activities..."
            enabledFilters={[]} // No date picker in search bar
            showClearButton={true}
            value={searchCriteria.keyword} // ✅ Pass current keyword
            onValueChange={handleKeywordChange} // ✅ Handle keyword changes
          />
        </div>

        {/* Mobile Map Section */}
        {showMap && (
          <div className="lg:hidden">
            <div className="h-[300px] border-b border-border">
              <CampMap
                camps={filteredCamps}
                selectedCamp={selectedCamp}
                onCampSelect={setSelectedCamp}
                userLocation={userLocation}
              />
            </div>
          </div>
        )}

        <SearchLayout
          sidebarCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileFiltersOpen={mobileFiltersOpen}
          onMobileToggle={setMobileFiltersOpen}
          hasActiveFilters={hasActiveFilters}
          showMap={showMap}
          sidebar={<FiltersPanel />}
          mapPanel={
            <div className="h-screen sticky top-0">
              <CampMap
                camps={filteredCamps}
                selectedCamp={selectedCamp}
                onCampSelect={setSelectedCamp}
                userLocation={userLocation}
              />
            </div>
          }
        >
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <ResultsHeader
                searchCriteria={searchCriteria}
                resultsCount={filteredCamps.length}
                viewMode={viewMode}
                showMap={showMap}
                onViewModeChange={setViewMode}
                onMapToggle={() => setShowMap(!showMap)}
                mobileFiltersOpen={mobileFiltersOpen}
                onMobileFiltersToggle={setMobileFiltersOpen}
                hasActiveFilters={hasActiveFilters}
                activeFiltersCount={activeFiltersCount}
                mobileFiltersSidebar={<FiltersPanel />}
              />
            </div>

            <CampResults
              camps={filteredCamps}
              viewMode={viewMode}
              searchCriteria={searchCriteria}
              onCampClick={setSelectedCamp}
              onClearFilters={handleClearAll} // Use enhanced clear function
              onClearDateRange={() =>
                setSearchCriteria((prev) => ({ ...prev, dateRange: undefined }))
              }
            />
          </div>
        </SearchLayout>

        <BackToTopButton />
      </main>
    </div>
  );
}
