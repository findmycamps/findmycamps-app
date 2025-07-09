import type { GroupedCamp } from "@/utils/campUtils";
import React, { useRef } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import CampCard from "./CampCard";

interface CampListProps {
  groupedCamps: GroupedCamp[];
  darkMode: boolean;
  onCardClick: (camp: GroupedCamp) => void;
}

function CampList({ groupedCamps, darkMode, onCardClick }: CampListProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (groupedCamps.length === 0) {
    return (
      <div className="text-center py-10">
        <p
          className={`text-center text-lg sm:text-xl py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          No camps found matching your criteria. Try adjusting your filters!
        </p>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto px-4 py-8">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide"
      >
        {groupedCamps.map((camp) => (
          <CampCard
            key={camp.name}
            camp={camp}
            darkMode={darkMode}
            onClick={() => onCardClick(camp)}
          />
        ))}
      </div>
      {/* Scroll Arrows */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-colors ${
          darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-white hover:bg-gray-200 text-gray-700"
        } shadow-md`}
      >
        <ArrowLeftCircle className="w-8 h-8" />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-colors ${
          darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-white hover:bg-gray-200 text-gray-700"
        } shadow-md`}
      >
        <ArrowRightCircle className="w-8 h-8" />
      </button>
    </div>
  );
}

export default CampList;
