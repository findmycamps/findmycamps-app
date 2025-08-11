// components/Search/ResultsHeader.tsx - Hide view toggle on mobile

import React from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, Map, MapPinOff, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchCriteria } from "@/components/SearchBar";
import { generateResultsTitle } from "@/utils/searchHelpers";

interface ResultsHeaderProps {
  searchCriteria: SearchCriteria;
  resultsCount: number;
  viewMode: 'list' | 'grid';
  showMap: boolean;
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onMapToggle: () => void;
  mobileFiltersOpen?: boolean;
  onMobileFiltersToggle?: (open: boolean) => void;
  hasActiveFilters?: boolean;
  activeFiltersCount?: number;
  mobileFiltersSidebar?: React.ReactNode;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  searchCriteria,
  resultsCount,
  viewMode,
  showMap,
  onViewModeChange,
  onMapToggle,
  mobileFiltersOpen,
  onMobileFiltersToggle,
  hasActiveFilters,
  activeFiltersCount = 0,
  mobileFiltersSidebar
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Title and count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            {generateResultsTitle(searchCriteria)}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {resultsCount} camps found
            {searchCriteria.dateRange?.from && (
              <span className="block sm:inline sm:ml-2 text-primary">
                📅 Available in selected date range
              </span>
            )}
          </p>
        </div>
        
        {/* ✅ Desktop Controls - Show list/grid toggle only on desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </Button>
          </div>

          <div className="border-l border-border pl-3">
            <Button
              variant={showMap ? 'default' : 'outline'}
              size="sm"
              onClick={onMapToggle}
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
      </div>

      {/* ✅ UPDATED: Mobile Controls - Only Filters button (no view toggle) */}
      <div className="flex lg:hidden items-center justify-between gap-2 p-3 bg-muted/30 rounded-lg">
        {/* Mobile Filters Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersToggle}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <SheetHeader className="px-4 py-4 border-b">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full">
              {mobileFiltersSidebar}
            </div>
          </SheetContent>
        </Sheet>

        {/* ✅ UPDATED: Map Toggle - Only button on mobile */}
        <Button
          variant={showMap ? 'default' : 'outline'}
          size="sm"
          onClick={onMapToggle}
          className="px-4"
        >
          <Map className="w-4 h-4 mr-2" />
          {showMap ? 'Hide Map' : 'Map'}
        </Button>
      </div>
    </div>
  );
};
