import React, { useState, useEffect, useCallback } from "react";
import { Camp } from "@/types/Camp";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface ImageSlideshowProps {
  camps: Camp[];
  darkMode: boolean;
}

const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80",
];

function ImageSlideshow({ darkMode }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden shadow-lg mb-0">
      {SLIDESHOW_IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Camp slideshow background ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/1200x500/${
              darkMode ? "4B5563" : "E5E7EB"
            }/${darkMode ? "F3F4F6" : "4B5563"}?text=Error`;
          }}
        />
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-300 z-10"
      >
        <ArrowLeftCircle size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-300 z-10"
      >
        <ArrowRightCircle size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {SLIDESHOW_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? darkMode
                  ? "bg-indigo-400"
                  : "bg-indigo-600"
                : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
            } hover:bg-indigo-500`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlideshow;
