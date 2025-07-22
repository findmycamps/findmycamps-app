import type { GroupedCamp } from "@/utils/campUtils";
// ✅ Import the new SearchCriteria type
import type { SearchCriteria } from "@/components/SearchBar";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ImageSlideshow from "@/components/ImageSlideshow";
import SearchBar from "@/components/SearchBar";
import CampList from "@/components/CampList";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CampProfilePage from "@/components/CampProfilePage";
import { useCamps } from "@/hooks/useCamps";
import { groupCamps } from "@/utils/campUtils";

export default function HomePage() {
  const { camps: allCamps, loading, error } = useCamps();

  // ✅ REMOVED: Old, individual state variables
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedLocation, setSelectedLocation] = useState("ALL");

  // ✅ ADDED: A single state object to hold all search criteria
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    keyword: "",
    location: "ALL",
    date: undefined,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<GroupedCamp | null>(null);
  const [featuredCamps, setFeaturedCamps] = useState<GroupedCamp[]>([]);
  const [artsCamps, setArtsCamps] = useState<GroupedCamp[]>([]);
  const [sportsCamps, setSportsCamps] = useState<GroupedCamp[]>([]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);


  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (loading || allCamps.length === 0) return;

    const allGrouped = groupCamps(allCamps);
    setFeaturedCamps(allGrouped.slice(0, 8));
    const arts = allCamps.filter((camp) => camp.category === "Arts");
    setArtsCamps(groupCamps(arts));
    const sports = allCamps.filter((camp) => camp.category === "Sports");
    setSportsCamps(groupCamps(sports));

  }, [searchCriteria, loading, allCamps]);

  const handleCardClick = (camp: GroupedCamp) => {
    setSelectedCamp(camp);
  };

  if (loading) return <div>Loading camps...</div>;
  if (error) return <div>Error loading camps.</div>;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="bg-background text-foreground">
        {selectedCamp ? (
          <CampProfilePage
            camp={selectedCamp}
            onBack={() => setSelectedCamp(null)} darkMode={isDarkMode}          />
        ) : (
          <>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <ImageSlideshow />

            <SearchBar onSearch={handleSearch} />

            <CampList
              title="Featured Camps"
              description="Our top picks for an unforgettable summer experience."
              groupedCamps={featuredCamps}
              onCardClick={handleCardClick}
              titleAlignment="center"
            />
            <CampList
              title="Artistic Adventures"
              description="Unleash creativity with camps focused on painting, drama, music, and more."
              groupedCamps={artsCamps}
              onCardClick={handleCardClick}
            />
            <CampList
              title="Get Active: Sports Camps"
              description="From soccer to swimming, find the perfect camp for your young athlete."
              groupedCamps={sportsCamps}
              onCardClick={handleCardClick}
            />
            <HowItWorks />
            <Testimonials />
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}
