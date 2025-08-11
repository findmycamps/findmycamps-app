// components/Search/CampListItem.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Sparkles } from "lucide-react";
import { GroupedCamp } from "@/utils/campUtils";
import { CATEGORIES_WITH_ICONS } from "@/data/constants";

interface CampListItemProps {
  camp: GroupedCamp;
  onClick: () => void;
}

export const CampListItem: React.FC<CampListItemProps> = ({
  camp,
  onClick,
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

  // Access session data for GroupedCamp display
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
