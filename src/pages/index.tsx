import type { GroupedCamp } from "@/utils/campUtils";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<GroupedCamp | null>(null);

  const [featuredCamps, setFeaturedCamps] = useState<GroupedCamp[]>([]);
  const [artsCamps, setArtsCamps] = useState<GroupedCamp[]>([]);
  const [sportsCamps, setSportsCamps] = useState<GroupedCamp[]>([]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

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
  }, [searchTerm, selectedLocation, loading, allCamps]);

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
            onBack={() => setSelectedCamp(null)}
            darkMode={false}
          />
        ) : (
          <>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <ImageSlideshow />
            <SearchBar
              onSearch={setSearchTerm}
              onLocationChange={setSelectedLocation}
              selectedLocation={selectedLocation}
            />

            {/* ✅ This section will now be centered */}
            <CampList
              title="Featured Camps"
              description="Our top picks for an unforgettable summer experience."
              groupedCamps={featuredCamps}
              onCardClick={handleCardClick}
              titleAlignment="center"
            />

            {/* These sections will remain left-aligned by default */}
            <CampList
              title="Artistic Adventures"
              description="Unleash creativity with camps focused on painting, drama, music, and more."
              groupedCamps={artsCamps}
              onCardClick={handleCardClick}
            />

            <CampList
              title="Get Active: Sports Camps"
              description="From cycling to soccer, find the perfect camp for your young athlete."
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
