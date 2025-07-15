import React from "react";
import { CATEGORIES_WITH_ICONS } from "../data/mockCamps";

interface ExploreByCategoryProps {
  onCategoryChange: (categoryName: string) => void;
  selectedCategory: string;
  darkMode: boolean;
}

function ExploreByCategory({
  onCategoryChange,
  selectedCategory,
  darkMode,
}: ExploreByCategoryProps) {
  return (
    <div className="my-8 md:my-12">
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Explore by Category
      </h2>
      <p
        className={`text-center text-sm sm:text-base mb-8 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Find the perfect summer experience based on your child's interests and
        passions.
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {CATEGORIES_WITH_ICONS.map((category) => {
          const IconComponent = category.icon;
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-600 text-white shadow-lg ring-indigo-400"
                      : "bg-indigo-500 text-white shadow-lg ring-indigo-500"
                    : darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 ring-gray-600"
                      : "bg-white hover:bg-gray-100 text-gray-700 shadow-md ring-gray-300"
                }`}
            >
              <IconComponent
                className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 ${
                  isActive
                    ? "text-white"
                    : darkMode
                      ? category.color.replace("text-", "text-gray-300")
                      : category.color
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isActive
                    ? "text-white"
                    : darkMode
                      ? "text-gray-200"
                      : "text-gray-800"
                }`}
              >
                {category.name === "All Categories" ? "All" : category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreByCategory;
