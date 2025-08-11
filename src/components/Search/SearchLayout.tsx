// components/Search/SearchLayout.tsx - Enhanced mobile responsiveness

import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";

interface SearchLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  sidebarCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileFiltersOpen: boolean;
  onMobileToggle: (open: boolean) => void;
  hasActiveFilters: boolean;
  showMap: boolean;
  mapPanel?: ReactNode;
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({
  children,
  sidebar,
  sidebarCollapsed,
  onToggleCollapse,
  mobileFiltersOpen,
  onMobileToggle,
  hasActiveFilters,
  showMap,
  mapPanel
}) => {
  return (
    <div className="flex min-h-screen">
      {/* ✅ UPDATED: Desktop Sidebar - Hide on mobile */}
      <div className={`hidden lg:block transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-[350px]'
      } bg-background border-r border-border relative`}>
        
        <div className="sticky top-0 h-screen">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full border border-border bg-background shadow-sm"
          >
            {sidebarCollapsed ? '>' : '<'}
          </Button>

          <div className={`transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } h-full`}>
            {!sidebarCollapsed && sidebar}
          </div>

          {sidebarCollapsed && (
            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="w-10 h-10 relative group"
                  title="Open Filters"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {hasActiveFilters && (
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

      {/* ✅ UPDATED: Main Content - Full width on mobile */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${
        showMap ? 'lg:pr-0' : 'lg:pr-8'
      }`}>
        {children}
      </div>

      {/* ✅ UPDATED: Map Panel - Hide on mobile, show on desktop */}
      {showMap && (
        <div className="hidden xl:block w-[500px] border-l border-border">
          {mapPanel}
        </div>
      )}

      {/* ✅ UPDATED: Mobile Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={onMobileToggle}>
        <SheetContent side="left" className="w-full sm:w-80 p-0">
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full">
            {sidebar}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
