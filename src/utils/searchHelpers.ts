// utils/searchHelpers.ts
// ✅ NO EXTERNAL IMPORTS - Just pure functions

export const extractAgeRange = (
  ageString: string,
): { min: number; max: number } | null => {
  const cleaned = ageString
    .toLowerCase()
    .replace(/years?/g, "")
    .trim();

  if (cleaned.includes("+")) {
    const minAge = parseInt(cleaned.replace("+", ""));
    return { min: minAge, max: 100 };
  }

  if (cleaned.includes("-")) {
    const parts = cleaned.split("-");
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max };
    }
  }

  const singleAge = parseInt(cleaned);
  if (!isNaN(singleAge)) {
    return { min: singleAge, max: singleAge };
  }

  return null;
};

export const ageRangesOverlap = (
  range1: { min: number; max: number },
  range2: { min: number; max: number },
): boolean => {
  return range1.min <= range2.max && range2.min <= range1.max;
};

export const generateResultsTitle = (searchCriteria: any): string => {
  let title = "";

  if (
    searchCriteria.selectedCategories &&
    searchCriteria.selectedCategories.length > 0
  ) {
    const categoryText =
      searchCriteria.selectedCategories.length === 1
        ? searchCriteria.selectedCategories[0]
        : `${searchCriteria.selectedCategories.length} categories`;

    if (searchCriteria.locationType === "nearby") {
      title = `${categoryText} camps near your location`;
    } else if (searchCriteria.locationType === "specific") {
      title = `${categoryText} camps in ${searchCriteria.location}`;
    } else {
      title = `${categoryText} camps`;
    }
  } else {
    if (searchCriteria.locationType === "nearby") {
      title =
        searchCriteria.keyword && searchCriteria.keyword !== "Nearby"
          ? `"${searchCriteria.keyword}" camps near you`
          : "Camps near your location";
    } else if (searchCriteria.locationType === "specific") {
      title =
        searchCriteria.keyword &&
        searchCriteria.keyword !== searchCriteria.location
          ? `"${searchCriteria.keyword}" camps in ${searchCriteria.location}`
          : `Camps in ${searchCriteria.location}`;
    } else {
      title = searchCriteria.keyword
        ? `Results for "${searchCriteria.keyword}"`
        : "All Camps";
    }
  }

  if (searchCriteria.dateRange?.from) {
    if (searchCriteria.dateRange.to) {
      const fromStr = searchCriteria.dateRange.from.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        },
      );
      const toStr = searchCriteria.dateRange.to.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      title += ` from ${fromStr} to ${toStr}`;
    } else {
      const dateStr = searchCriteria.dateRange.from.toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      );
      title += ` for ${dateStr}`;
    }
  }

  return title;
};
