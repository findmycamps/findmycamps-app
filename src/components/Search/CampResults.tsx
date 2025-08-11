// components/Search/CampResults.tsx - Fixed TypeScript error

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CampCard from "@/components/CampCard";
import { CampListItem } from "@/components/Search/CampListItem";
import { GroupedCamp } from "@/utils/campUtils";
import { SearchCriteria } from "@/components/SearchBar";

interface CampResultsProps {
  camps: GroupedCamp[];
  viewMode: "list" | "grid";
  searchCriteria: SearchCriteria;
  onCampClick: (camp: GroupedCamp) => void;
  onClearFilters: () => void;
  onClearDateRange: () => void;
}

export const CampResults: React.FC<CampResultsProps> = ({
  camps,
  viewMode,
  searchCriteria,
  onCampClick,
  onClearFilters,
  onClearDateRange,
}) => {
  if (camps.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">No camps found</h3>
          <p className="text-muted-foreground mb-4">
            {searchCriteria.dateRange?.from
              ? `No camps available in the selected date range. Try selecting different dates or clearing filters.`
              : searchCriteria.locationType === "nearby"
                ? "No camps found near your location. Try expanding your search area or browse all camps."
                : "Try adjusting your search criteria or filters to see more results."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onClearFilters}>Clear All Filters</Button>
            {searchCriteria.dateRange?.from && (
              <Button variant="outline" onClick={onClearDateRange}>
                Clear Date Range
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ FIXED: Simplified logic - Mobile always shows grid, desktop shows based on viewMode
  if (viewMode === "list") {
    // List view only on desktop (lg and up)
    return (
      <div className="hidden lg:block space-y-4">
        {camps.map((camp, index) => (
          <CampListItem
            key={index}
            camp={camp}
            onClick={() => onCampClick(camp)}
          />
        ))}
      </div>
    );
  }

  // ✅ Grid view - Always show on mobile, show on desktop when grid is selected
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 justify-items-center">
      {camps.map((camp, index) => (
        <div key={index} className="w-full max-w-sm">
          <CampCard camp={camp} onClick={() => onCampClick(camp)} />
        </div>
      ))}
    </div>
  );
};
