import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=600&fit=crop",
    title: "Find the Perfect Summer Camp",
    subtitle:
      "Discover top-rated camps across Canada for your child's interests",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=600&fit=crop",
    title: "Adventure Awaits",
    subtitle:
      "From wilderness adventures to creative arts, find the perfect match",
  },
  {
    image:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&h=600&fit=crop",
    title: "Memories That Last",
    subtitle: "Give your child an unforgettable summer experience",
  },
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  {slide.subtitle}
                </p>
                {/* ✅ CHANGE: Replaced with a standard <button> element */}
                <button className="px-8 py-3 text-lg font-semibold rounded-lg bg-golden-amber hover:bg-golden-amber/90 text-primary transition-colors">
                  Start Exploring Camps
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ✅ CHANGE: Navigation arrows are now standard <button> elements */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator (already a button, no change needed here) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
