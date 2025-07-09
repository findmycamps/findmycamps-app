import type { Camp } from "@/types/Camp";
import type { GroupedCamp, CampSession } from "@/utils/campUtils";
import React from "react";
import { MapPin, Users, DollarSign, Tag, Star, Calendar } from "lucide-react";

interface CampCardProps {
  camp: GroupedCamp;
  darkMode: boolean;
  onClick: () => void;
}

function CampCard({ camp, darkMode, onClick }: CampCardProps) {
  const imageUrl =
    camp.image || "https://placehold.co/600x400?text=FindMyCamps";

  // Helper to format a single date range
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

  // Helper to determine the price display
  const getPriceDisplay = () => {
    if (camp.sessions.length === 1) {
      return `$${camp.sessions[0].price}`;
    }
    const prices = camp.sessions.map((s) => s.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice
      ? `$${minPrice}`
      : `$${minPrice} - $${maxPrice}`;
  };
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-80 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <img
        src={imageUrl}
        alt={camp.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold truncate">{camp.name}</h3>
        <div className="flex items-center mt-3 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          <span>{camp.location.address}</span>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <Users className="w-4 h-4 mr-2 text-green-500" />
          <span>Ages: {camp.ageRange}</span>
        </div>
      </div>

      {/* Informational List of Dates */}
      <div className="p-4 border-t border-b">
        <div className="flex items-center text-sm font-medium mb-2">
          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
          <span>Available Dates:</span>
        </div>
        <ul className="space-y-1 text-xs">
          {camp.sessions.map((session) => (
            <li
              key={session.campId}
              className={`pl-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {formatDateRange(session)}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer with Price Range */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center font-bold text-lg">
          <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
          <span>{getPriceDisplay()}</span>
        </div>
        <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          View Details
        </span>
      </div>
    </div>
  );
}

export default CampCard;
