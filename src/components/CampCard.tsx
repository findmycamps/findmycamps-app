import type { GroupedCamp, CampSession } from "@/utils/campUtils";
import React from "react";
import { MapPin, Calendar, Sparkles } from "lucide-react";
import { CATEGORIES_WITH_ICONS } from "../data/constants";

// HELPER COMPONENT: Renders the dynamic icon-based thumbnail
const CampThumbnail = ({ camp }: { camp: GroupedCamp }) => {
  const categoryInfo = CATEGORIES_WITH_ICONS.find(
    (c) => c.name.toLowerCase() === camp.category?.toLowerCase(),
  );

  const Icon = categoryInfo?.icon || Sparkles;
  const color = categoryInfo?.color || "text-muted-foreground";
  // ✅ Directly use the bgColor property with a fallback to bg-muted
  const bgColor = categoryInfo?.bgColor || "bg-muted";

  return (
    <div
      className={`w-full h-40 flex items-center justify-center ${bgColor} group-hover:scale-105 transition-transform duration-300`}
    >
      <Icon className={`w-16 h-16 ${color}`} strokeWidth={1.5} />
    </div>
  );
};

interface CampCardProps {
  camp: GroupedCamp;
  onClick: () => void;
}

function CampCard({ camp, onClick }: CampCardProps) {
  const getPriceDisplay = () => {
    if (!camp.sessions || camp.sessions.length === 0) return "N/A";
    if (camp.sessions.length === 1) return `$${camp.sessions[0].price}`;
    const prices = camp.sessions.map((s) => s.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice
      ? `$${minPrice}`
      : `$${minPrice} - $${maxPrice}`;
  };

  const formatDateRange = (session: CampSession) => {
    const start = new Date(session.dates.startDate).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" },
    );
    const end = new Date(session.dates.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${start} - ${end}`;
  };

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-80 group rounded-lg shadow-md overflow-hidden bg-card cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      <div className="overflow-hidden">
        {camp.image ? (
          <img
            src={camp.image}
            alt={camp.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CampThumbnail camp={camp} />
        )}
      </div>

      <div className="p-4 flex flex-col space-y-3">
        <div>
          <h3 className="text-lg font-bold truncate text-card-foreground transition-colors group-hover:text-primary">
            {camp.name}
          </h3>
          {camp.sessions?.[0]?.location && (
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {camp.sessions[0].location.address},{" "}
                {camp.sessions[0].location.city}
              </span>
            </div>
          )}
        </div>

        {camp.sessions.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDateRange(camp.sessions[0])}</span>
            {camp.sessions.length > 1 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-muted rounded-full">
                +{camp.sessions.length - 1} more
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {camp.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground">
            Ages: {camp.ageRange}
          </p>
          <p className="text-lg font-bold text-card-foreground">
            {getPriceDisplay()}
            <span className="text-sm font-normal text-muted-foreground">
              /week
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CampCard;
