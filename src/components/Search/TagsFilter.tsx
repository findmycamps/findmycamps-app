// components/Search/TagsFilter.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagsFilterProps {
  tags: string[];
  allTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  tags,
  allTags,
  onTagToggle
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">Popular Activities</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={tags.includes(tag) ? "default" : "secondary"}
            className={`cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground text-xs ${
              tags.includes(tag) 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-primary/10"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
