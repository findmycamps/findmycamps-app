import React, { useRef } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import CampCard from "./CampCard";

const CampList = ({ camps, darkMode, onCardClick }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };
  

  if (camps.length === 0) {
    return (
      <p
        className={`text-center text-lg sm:text-xl py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        No camps found matching your criteria. Try adjusting your filters!
      </p>
    );
  }

  return (
    <div className="my-8 md:my-12">
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Featured Summer Camps
      </h2>

      {/* 1) outer wrapper allows overflow-visible so arrows can sit outside */}
      <div className="relative w-full overflow-visible">
        {/* 2) left arrow, pulled outside by 3rem */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className={`absolute -left-12 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-colors ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          } shadow-md`}
        >
          <ArrowLeftCircle size={30} />
        </button>

        {/* 3) scrollable list with 3rem padding on both sides */}
        <div
          ref={scrollContainerRef}
          className={`flex space-x-6 overflow-x-auto pb-4 px-12 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent ${
            darkMode ? "scrollbar-thumb-gray-600" : "scrollbar-thumb-gray-400"
          }`}
        >
          {camps.map((camp) => (
            <CampCard
              key={camp.id}
              camp={camp}
              darkMode={darkMode}
              onClick={onCardClick}
            />
          ))}
        </div>

        {/* 4) right arrow, also outside by 3rem */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className={`absolute -right-12 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-colors ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          } shadow-md`}
        >
          <ArrowRightCircle size={30} />
        </button>
      </div>
    </div>
  );
};

export default CampList;
