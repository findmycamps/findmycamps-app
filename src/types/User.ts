// A new interface to define the structure for each child's profile
export interface KidProfile {
  name: string;
  age: number;
  interests?: string[]; // Optional: e.g., ['soccer', 'painting']
}

export interface User {
  userId: string;
  email: string;
  type: "parent" | "camp";

  // --- Personal Information (Updated) ---
  firstName?: string; // Added
  lastName?: string; // Added
  phone?: string;
  location?: {
    city: string;
    province: string;
  };

  // --- Child Information (Updated) ---
  kids?: KidProfile[]; // Added to store detailed info for each child
  numOfKids?: number; // Can be derived from kids.length or kept for quick access

  // --- Personalization & Activity ---
  tags?: string[];
  savedCamps?: string[];
  recentSearches?: string[];
  visitedCamps?: string[];
  notes?: string;
}
