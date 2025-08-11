// hooks/useSearchPage.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DateRange } from "react-day-picker";
import { SearchCriteria } from "@/components/SearchBar";
import { useCamps } from "@/hooks/useCamps";
import { groupCamps, type GroupedCamp } from "@/utils/campUtils";
import { PRICE_RANGES } from "@/data/searchConstants";
import { extractAgeRange, ageRangesOverlap } from "@/utils/searchHelpers";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  ageGroups: string[];
  tags: string[];
}

export const useSearchPage = () => {
  const router = useRouter();
  const { camps: allCamps, loading, error } = useCamps();
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    keyword: "",
    location: "ALL",
    dateRange: undefined,
    locationCoords: undefined,
    locationType: 'all',
    selectedCategories: undefined
  });
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    ageGroups: [],
    tags: []
  });
  
  const [filteredCamps, setFilteredCamps] = useState<GroupedCamp[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize search from URL parameters
  useEffect(() => {
    if (router.isReady) {
      const { keyword, location, dateFrom, dateTo, lat, lng, locationType, categories } = router.query;
      
      // Parse location coordinates if provided
      const locationCoords = (lat && lng) ? {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      } : undefined;

      // Parse date range from URL with validation
      let parsedDateRange: DateRange | undefined = undefined;
      if (dateFrom && typeof dateFrom === 'string') {
        const fromDate = new Date(dateFrom);
        if (!isNaN(fromDate.getTime())) {
          parsedDateRange = { from: fromDate };
          
          if (dateTo && typeof dateTo === 'string') {
            const toDate = new Date(dateTo);
            if (!isNaN(toDate.getTime())) {
              parsedDateRange.to = toDate;
            }
          }
        }
      }

      // Parse multiple categories from URL
      let parsedCategories: string[] = [];
      if (categories && typeof categories === 'string') {
        parsedCategories = categories.split(',').filter(cat => cat.trim() !== '');
      }

      setSearchCriteria({
        keyword: (keyword as string) || "",
        location: (location as string) || "ALL",
        dateRange: parsedDateRange,
        locationCoords: locationCoords,
        locationType: (locationType as 'nearby' | 'specific' | 'all') || 'all',
        selectedCategories: parsedCategories.length > 0 ? parsedCategories : undefined
      });

      // Auto-select multiple categories in filters
      if (parsedCategories.length > 0) {
        setFilters(prev => ({
          ...prev,
          categories: parsedCategories
        }));
      }

      // Set user location for map display only
      if (locationCoords) {
        setUserLocation(locationCoords);
      }
    }
  }, [router.isReady, router.query]);

  // Main filtering logic
  useEffect(() => {
    if (loading || !allCamps.length) return;

    let filtered = [...allCamps]; // This is Camp[]

    // Apply keyword search
    if (searchCriteria.keyword && 
        searchCriteria.keyword !== 'nearby' && 
        searchCriteria.keyword !== 'Nearby' &&
        searchCriteria.locationType !== 'specific' &&
        !searchCriteria.selectedCategories?.length) {
      const keyword = searchCriteria.keyword.toLowerCase();
      filtered = filtered.filter(camp => 
        camp.name.toLowerCase().includes(keyword) ||
        camp.description.toLowerCase().includes(keyword) ||
        camp.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // Apply location-based filtering using Camp interface
    if (searchCriteria.locationType === 'nearby' && searchCriteria.locationCoords) {
      filtered = filtered.filter(camp => {
        const campCity = camp.location.city.toLowerCase().trim();
        const campProvince = camp.location.province.toLowerCase().trim();
        
        return campCity === 'victoria' && campProvince === 'bc';
      });
      
      console.log(`📍 Nearby search: Found ${filtered.length} camps`);
      
    } else if (searchCriteria.locationType === 'specific' && searchCriteria.location !== 'ALL') {
      const locationQuery = searchCriteria.location.toLowerCase();
      filtered = filtered.filter(camp => {
        const campCity = camp.location.city.toLowerCase();
        const campProvince = camp.location.province.toLowerCase();
        
        if (locationQuery.includes('victoria')) {
          return campCity.includes('victoria') && campProvince.includes('bc');
        }
        
        const cityQuery = locationQuery.replace(/,.*/, '').replace(/ bc$/i, '').trim();
        return campCity.includes(cityQuery);
      });
      
      console.log(`🏙️ Location search for "${searchCriteria.location}": Found ${filtered.length} camps`);
      
    } else if (searchCriteria.location !== "ALL" && searchCriteria.locationType === 'all') {
      filtered = filtered.filter(camp => 
        camp.location.province === searchCriteria.location
      );
    }

    // Apply date range filtering using Camp interface
    if (searchCriteria.dateRange?.from) {
      const startDate = new Date(searchCriteria.dateRange.from);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = searchCriteria.dateRange.to 
        ? new Date(searchCriteria.dateRange.to)
        : new Date(searchCriteria.dateRange.from);
      endDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(camp => {
        if (!camp.dates) return false;
        
        const campStart = new Date(camp.dates.startDate);
        const campEnd = new Date(camp.dates.endDate);
        campStart.setHours(0, 0, 0, 0);
        campEnd.setHours(23, 59, 59, 999);
        
        return campStart <= endDate && campEnd >= startDate;
      });
      
      console.log(`📅 Date range filtering: Found ${filtered.length} camps`);
    }

    // Apply category filters (combines SearchBar categories and sidebar categories)
    const allSelectedCategories = [
      ...(searchCriteria.selectedCategories || []),
      ...filters.categories
    ];
    const uniqueCategories = Array.from(new Set(allSelectedCategories));

    if (uniqueCategories.length > 0) {
      filtered = filtered.filter(camp => 
        uniqueCategories.includes(camp.category)
      );
    }

    // Apply price range filter using Camp interface
    filtered = filtered.filter(camp => {
      const campPrice = camp.price || 0;
      return campPrice >= filters.priceRange[0] && campPrice <= filters.priceRange[1];
    });

    // Apply age group filtering
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(camp => {
        const campAgeRange = extractAgeRange(camp.ageRange);
        if (!campAgeRange) return false;

        return filters.ageGroups.some(selectedAgeGroup => {
          const selectedRange = extractAgeRange(selectedAgeGroup);
          if (!selectedRange) return false;
          return ageRangesOverlap(campAgeRange, selectedRange);
        });
      });
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(camp => 
        filters.tags.some(tag => camp.tags.includes(tag))
      );
    }

    // Only convert to GroupedCamp[] at the very end
    setFilteredCamps(groupCamps(filtered));
  }, [allCamps, searchCriteria, filters, loading]);

  // Event handlers
  const handleSearchBarSelection = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    
    if (criteria.selectedCategories && criteria.selectedCategories.length > 0) {
      setFilters(prev => ({
        ...prev,
        categories: criteria.selectedCategories!
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: []
      }));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category)
      }));
      
      // Also remove from SearchBar selected categories
      if (searchCriteria.selectedCategories?.includes(category)) {
        const newCategories = searchCriteria.selectedCategories.filter(cat => cat !== category);
        setSearchCriteria(prev => ({
          ...prev,
          selectedCategories: newCategories.length > 0 ? newCategories : undefined
        }));
      }
    }
  };

  const handlePriceRangeChange = (value: string) => {
    const selectedRange = PRICE_RANGES.find(range => range.value === value);
    if (selectedRange) {
      setFilters(prev => ({ ...prev, priceRange: selectedRange.range }));
    }
  };

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      ageGroups: checked 
        ? [...prev.ageGroups, ageGroup]
        : prev.ageGroups.filter(a => a !== ageGroup)
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      ageGroups: [],
      tags: []
    });
    // Also clear SearchBar categories
    setSearchCriteria(prev => ({
      ...prev,
      selectedCategories: undefined
    }));
  };

  // Computed values
  const allTags = Array.from(new Set(allCamps.flatMap(camp => camp.tags))).slice(0, 10);

  return {
    // State
    searchCriteria,
    filters,
    filteredCamps,
    userLocation,
    allTags,
    loading,
    error,
    
    // Setters
    setSearchCriteria,
    setFilters,
    
    // Handlers
    handleSearchBarSelection,
    handleCategoryChange,
    handlePriceRangeChange,
    handleAgeGroupChange,
    handleTagToggle,
    clearAllFilters
  };
};
