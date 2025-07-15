import type { GroupedCamp } from "@/utils/campUtils";
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
import { useCamps } from "@/hooks/useCamps";
import { groupCamps } from "@/utils/campUtils";

export default function HomePage() {
  const { camps: allCamps, loading, error } = useCamps();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedCamp, setSelectedCamp] = useState<GroupedCamp | null>(null);
  const [displayCamps, setDisplayCamps] = useState<GroupedCamp[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (loading) return;

    // To feature speicifc campids use the uncomment the code below:
    //const featuredCampIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    // let filteredCamps  = allCamps.filter(camp => featuredCampIds.includes(camp.campId));

    let filteredCamps = [...allCamps]; //and comment this

    if (selectedCategory !== "All Categories") {
      filteredCamps = filteredCamps.filter(
        (camp) => camp.category === selectedCategory,
      );
    }
    const grouped = groupCamps(filteredCamps);
    setDisplayCamps(grouped);
  }, [searchTerm, selectedLocation, selectedCategory, loading, allCamps]);

  const handleCardClick = (camp: GroupedCamp) => {
    setSelectedCamp(camp);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading camps...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading camps. Please try again later.
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <main
        className={`font-sans antialiased ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}
      >
        {selectedCamp ? (
          <CampProfilePage
            camp={selectedCamp}
            onBack={() => setSelectedCamp(null)}
            darkMode={darkMode}
          />
        ) : (
          <>
            <Header
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
            />
            <ImageSlideshow camps={allCamps} darkMode={darkMode} />
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
              groupedCamps={displayCamps}
              darkMode={darkMode}
              onCardClick={handleCardClick}
            />

            <HowItWorks darkMode={darkMode} />
            <Testimonials darkMode={darkMode} />
            <Footer darkMode={darkMode} />
          </>
        )}
      </main>
    </div>
  );
}
