import type { Camp } from "@/types/Camp";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ImageSlideshow from "@/components/ImageSlideshow";
import SearchBar from "@/components/SearchBar";
import ExploreByCategory from "@/components/ExploreByCategory";
import CampList from "@/components/CampList";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CampProfilePage from "@/components/CampProfilePage";
import { ALL_CAMPS_DATA } from "@/data/mockCamps";

export default function HomePage() {
  const [filteredCamps, setFilteredCamps] = useState<Camp[]>(ALL_CAMPS_DATA);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900");
      document.body.classList.remove("bg-gray-100");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-gray-100");
      document.body.classList.remove("bg-gray-900");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  useEffect(() => {
    let camps = ALL_CAMPS_DATA;
    if (searchTerm) {
      camps = camps.filter(
        (camp) =>
          camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          camp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          camp.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }
    if (selectedLocation !== "ALL") {
      camps = camps.filter((camp) => camp.province === selectedLocation);
    }
    if (selectedCategory !== "All Categories") {
      camps = camps.filter((camp) => camp.category === selectedCategory);
    }
    setFilteredCamps(camps);
  }, [searchTerm, selectedLocation, selectedCategory]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {!selectedCamp && <ImageSlideshow darkMode={darkMode} />}

      {selectedCamp ? (
        <CampProfilePage
          camp={selectedCamp}
          onBack={() => setSelectedCamp(null)}
          darkMode={darkMode}
        />
      ) : (
        <>
          {/* Headline & subtitle below slideshow */}
          <div className="w-full flex flex-col items-center mt-8 mb-2 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-indigo-600 dark:text-indigo-600 mb-2">
              Find the Perfect Summer Camp
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-center text-blue-600 dark:text-blue-600 max-w-2xl">
              Discover top-rated camps across Canada for your child's interests.
            </p>
          </div>
          <main className="container mx-auto px-4 sm:px-6 flex-grow">
            <SearchBar
              onSearch={setSearchTerm}
              onLocationChange={setSelectedLocation}
              selectedLocation={selectedLocation}
              darkMode={darkMode}
            />
            <ExploreByCategory
              onCategoryChange={setSelectedCategory}
              selectedCategory={selectedCategory}
              darkMode={darkMode}
            />
            <CampList
              camps={filteredCamps}
              darkMode={darkMode}
              onCardClick={setSelectedCamp}
            />
          </main>
          <HowItWorks darkMode={darkMode} />
          <Testimonials darkMode={darkMode} />
          <Footer darkMode={darkMode} />
        </>
      )}
    </div>
  );
}
