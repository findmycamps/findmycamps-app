import { Compass, Sun, Palette, Cpu, Leaf, BookOpen } from "lucide-react";

// --- Camp type ---
export interface Camp {
  id: number;
  name: string;
  province: string;
  city: string;
  description: string;
  ageRange: string;
  price: number;
  imageUrl: string;
  rating: number;
  tags: string[];
  category: string;
}

// --- Province type ---
export interface Province {
  code: string;
  name: string;
}

// --- Category type ---
export interface CategoryWithIcon {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const ALL_CAMPS_DATA = [
  {
    id: 1,
    name: "Wilderness Explorers",
    province: "BC",
    city: "Vancouver",
    description: "Outdoor adventures & nature skills.",
    ageRange: "10-14",
    price: 450,
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    tags: ["Outdoor", "Adventure", "BC"],
    category: "Adventure",
  },
  {
    id: 2,
    name: "Code Crafters Academy",
    province: "ON",
    city: "Toronto",
    description: "Learn to code and build cool projects.",
    ageRange: "12-16",
    price: 550,
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", // Coding, computer
    rating: 4.9,
    tags: ["Tech", "Coding", "ON"],
    category: "Technology",
  },
  {
    id: 3,
    name: "Artistic Minds Studio",
    province: "QC",
    city: "Montreal",
    description: "Unleash creativity with painting & sculpture.",
    ageRange: "8-12",
    price: 380,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80", // Arts, painting
    rating: 4.7,
    tags: ["Arts", "Creative", "QC"],
    category: "Arts",
  },
  {
    id: 4,
    name: "Sports Stars Camp",
    province: "AB",
    city: "Calgary",
    description: "Multi-sport activities and team building.",
    ageRange: "9-13",
    price: 400,
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80", // Soccer/field sports
    rating: 4.6,
    tags: ["Sports", "Active", "AB"],
    category: "Sports",
  },
  {
    id: 5,
    name: "Science Innovators Lab",
    province: "MB",
    city: "Winnipeg",
    description: "Fun experiments and science discovery.",
    ageRange: "11-15",
    price: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80", // Science lab
    rating: 4.8,
    tags: ["Science", "STEM", "MB"],
    category: "Science",
  },
  {
    id: 6,
    name: "Mountain Bike Mania",
    province: "BC",
    city: "Whistler",
    description: "Thrilling trails for all skill levels.",
    ageRange: "13-17",
    price: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80", // Biking, adventure
    rating: 4.9,
    tags: ["Sports", "Adventure", "BC"],
    category: "Sports",
  },
  {
    id: 7,
    name: "Future Leaders Program",
    province: "ON",
    city: "Ottawa",
    description: "Develop leadership and communication skills.",
    ageRange: "14-18",
    price: 520,
    imageUrl:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // Kids teamwork/outdoors
    rating: 4.7,
    tags: ["Leadership", "Education", "ON"],
    category: "Education",
  },
  {
    id: 8,
    name: "Culinary Kids",
    province: "QC",
    city: "Quebec City",
    description: "Cooking basics and gourmet fun.",
    ageRange: "7-11",
    price: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", // Cooking/kids in kitchen
    rating: 4.5,
    tags: ["Cooking", "Creative", "QC"],
    category: "Arts",
  },
  {
    id: 9,
    name: "Robotics Challenge",
    province: "AB",
    city: "Edmonton",
    description: "Build and program your own robots.",
    ageRange: "12-16",
    price: 580,
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", // Robotics
    rating: 4.9,
    tags: ["Tech", "Robotics", "AB"],
    category: "Technology",
  },
  {
    id: 10,
    name: "Island Survival Skills",
    province: "PE",
    city: "Charlottetown",
    description: "Learn survival techniques on the coast.",
    ageRange: "13-17",
    price: 620,
    imageUrl:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80", // Campfire, survival
    rating: 4.8,
    tags: ["Outdoor", "Adventure", "PE"],
    category: "Adventure",
  },
  {
    id: 11,
    name: "Digital Art & Animation",
    province: "NS",
    city: "Halifax",
    description: "Create stunning digital masterpieces.",
    ageRange: "11-15",
    price: 480,
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80", // Digital art/animation
    rating: 4.7,
    tags: ["Arts", "Tech", "NS"],
    category: "Arts",
  },
  {
    id: 12,
    name: "Hockey Heroes Camp",
    province: "SK",
    city: "Saskatoon",
    description: "Improve your skills on the ice.",
    ageRange: "10-14",
    price: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80", // Hockey/kids
    rating: 4.6,
    tags: ["Sports", "SK"],
    category: "Sports",
  },
];

export const PROVINCES = [
  { code: "ALL", name: "All Provinces" },
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
];

export const CATEGORIES_WITH_ICONS = [
  { name: "All Categories", icon: Compass, color: "text-blue-500" },
  { name: "Adventure", icon: Compass, color: "text-green-500" },
  { name: "Sports", icon: Sun, color: "text-orange-500" },
  { name: "Arts", icon: Palette, color: "text-purple-500" },
  { name: "Technology", icon: Cpu, color: "text-sky-500" },
  { name: "Science", icon: Leaf, color: "text-teal-500" },
  { name: "Education", icon: BookOpen, color: "text-indigo-500" },
];
