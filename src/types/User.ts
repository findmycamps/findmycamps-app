export type UserType = "parent" | "camp" | "soloCamper";

// Profile for an individual child
export interface KidProfile {
  name: string;
  age: string; // Storing as string from form, can be converted to number later
  interests: string[];
}

// The main user profile structure to be stored in Firestore
export interface UserProfile {
  userId: string; // Corresponds to Firebase Auth UID
  email: string;

  // This will be determined by the selections in the signup form
  roles: UserType[];

  firstName: string;
  lastName: string;

  location: {
    city: string;
    province: string;
  };

  // User's personal interests, if they are a "soloCamper"
  personalInterests: string[];

  // Children's details, if they are a "parent"
  children: KidProfile[];
  // numOfKids?: number; //Not needed as can be derived from userProfile.children.length

  // --- Personalization & Activity ---
  tags?: string[];
  phone?: string;
  savedCamps?: string[];
  recentSearches?: string[];
  visitedCamps?: string[];
  notes?: string;
  createdAt: string; // ISO date string
}
