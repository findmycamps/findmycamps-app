import type { Camp } from "@/types/Camp";
import React from "react";
import { MapPin, Users, DollarSign, Tag, Star } from "lucide-react";

interface CampCardProps {
  camp: Camp;
  darkMode: boolean;
  onClick: (camp: Camp) => void;
}

function CampCard({ camp, darkMode, onClick }: CampCardProps) {
  return (
    <div
      className={`flex-shrink-0 w-72 sm:w-80 md:w-[340px] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 flex flex-col cursor-pointer ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
      }`}
      onClick={() => onClick(camp)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(camp);
        }
      }}
    >
      <img
        src={camp.imageUrl}
        alt={camp.name}
        className="w-full h-40 sm:h-48 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://placehold.co/600x400/${
            darkMode ? "4B5563" : "E5E7EB"
          }/${darkMode ? "F3F4F6" : "4B5563"}?text=Img+Error`;
        }}
      />
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3
          className={`text-lg sm:text-xl font-semibold mb-2 tracking-tight ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          {camp.name}
        </h3>
        <p
          className={`text-xs sm:text-sm mb-3 flex-grow ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {camp.description}
        </p>
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex items-center">
            <MapPin
              className={`w-3.5 h-3.5 mr-1.5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />{" "}
            {camp.city}, {camp.province}
          </div>
          <div className="flex items-center">
            <Users
              className={`w-3.5 h-3.5 mr-1.5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />{" "}
            Ages: {camp.ageRange}
          </div>
          <div className="flex items-center">
            <DollarSign
              className={`w-3.5 h-3.5 mr-1.5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />{" "}
            C${camp.price}/week
          </div>
          <div className="flex items-center">
            <Tag
              className={`w-3.5 h-3.5 mr-1.5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />{" "}
            {camp.category}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1" />
            <span className="font-semibold text-sm">{camp.rating}</span>
          </div>
          <button
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampCard;
