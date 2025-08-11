// components/Search/AgeGroupsFilter.tsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AGE_GROUPS } from "@/data/searchConstants";

interface AgeGroupsFilterProps {
  ageGroups: string[];
  onAgeGroupChange: (ageGroup: string, checked: boolean) => void;
}

export const AgeGroupsFilter: React.FC<AgeGroupsFilterProps> = ({
  ageGroups,
  onAgeGroupChange
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">Age Groups</h3>
      <div className="space-y-3">
        {AGE_GROUPS.map(ageGroup => (
          <div key={ageGroup} className="flex items-center space-x-2">
            <Checkbox
              id={ageGroup}
              checked={ageGroups.includes(ageGroup)}
              onCheckedChange={(checked) => 
                onAgeGroupChange(ageGroup, checked as boolean)
              }
            />
            <Label htmlFor={ageGroup} className="text-sm font-medium">
              {ageGroup}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
