import React from "react";
import { CATEGORIES_WITH_ICONS } from "../data/constants";

interface ExploreByCategoryProps {
  onCategoryChange: (categoryName: string) => void;
  selectedCategory: string;
}

function ExploreByCategory({
  onCategoryChange,
  selectedCategory,
}: ExploreByCategoryProps) {
  // ✅ FIX 2: Remove the .filter() to show all categories, including "All Categories"
  const displayCategories = CATEGORIES_WITH_ICONS;

  return (
    <section className="py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Explore Camp Categories
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
          Find the perfect summer experience based on your child's interests and
          passions.
        </p>
        <div className="mt-12 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {displayCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted/50 hover:border-secondary hover:bg-secondary/10"
                }`}
              >
                {/* ✅ FIX 1: Add fixed width/height (w-16 h-16) to create a perfect circle */}
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full bg-background`}
                >
                  <Icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <span className="font-semibold text-sm text-center">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExploreByCategory;
