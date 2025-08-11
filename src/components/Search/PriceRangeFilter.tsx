// components/Search/PriceRangeFilter.tsx
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRICE_RANGES } from "@/data/searchConstants";

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onChange: (value: string) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  onChange
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">Price Range</h3>
      <Select
        value={`${priceRange[0]}-${priceRange[1]}`}
        onValueChange={onChange}
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
  );
};
