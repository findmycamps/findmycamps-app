// components/Search/CategoriesFilter.tsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES_WITH_ICONS } from "@/data/constants";

interface CategoriesFilterProps {
  selectedCategories?: string[];
  filterCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  selectedCategories,
  filterCategories,
  onCategoryChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">Categories</h3>

      {/* Show SearchBar selected categories */}
      {selectedCategories && selectedCategories.length > 0 && (
        <div className="mb-4 p-3 bg-primary/5 rounded-lg">
          <div className="text-sm font-medium text-primary mb-2">
            From Search ({selectedCategories.length} selected):
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="default" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {CATEGORIES_WITH_ICONS.filter(
          (cat) => cat.name !== "All Categories",
        ).map((category) => (
          <div key={category.name} className="flex items-center space-x-2">
            <Checkbox
              id={category.name}
              checked={
                filterCategories.includes(category.name) ||
                selectedCategories?.includes(category.name) ||
                false
              }
              onCheckedChange={(checked) =>
                onCategoryChange(category.name, checked as boolean)
              }
            />
            <Label htmlFor={category.name} className="text-sm font-medium">
              {category.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
