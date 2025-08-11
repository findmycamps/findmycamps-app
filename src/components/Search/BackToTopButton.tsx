import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={scrollToTop}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border shadow-sm">
          Back to Top
        </span>
      </div>
    </div>
  );
};
