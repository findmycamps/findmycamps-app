// hooks/useStickySearchBar.ts - Enhanced with animation range support
import { useState, useEffect } from 'react';

export const useStickySearchBar = (threshold: number = 150) => {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsSticky(currentScrollY > threshold);
      
      // Calculate animation progress (0 to 1) based on scroll position
      const maxScroll = 650; // Animation completes at 650px scroll
      const progress = Math.min(Math.max((currentScrollY - threshold) / (maxScroll - threshold), 0), 1);
      setAnimationProgress(progress);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [threshold]);

  return { isSticky, scrollY, animationProgress };
};
