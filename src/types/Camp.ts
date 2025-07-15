export interface Camp {
  campId: string;
  createdBy: string; // Reference to ownerId
  name: string;
  description: string;
  category: string;
  tags: string[];
  location: {
    address: string;
    city: string;
    province: string;
  };
  dates: {
    startDate: Date;
    endDate: Date;
  };
  ageRange: string;
  price: number;
  rating: number;
  camplink: string;
  createdAt: Date;
  savesCount: number; // To show camp popularity

  // --- Optional for MVP ---
  image?: string; // Now optional
  testimonials?: {
    userId: string;
    review: string;
    stars: number;
    createdAt: Date;
  }[];
}
