import {
  TentTree,
  Compass,
  Sun,
  Palette,
  Cpu,
  Atom,
  BookOpen,
} from "lucide-react";

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
  { name: "Adventure", icon: TentTree, color: "text-green-500" },
  { name: "Sports", icon: Sun, color: "text-yellow-500" },
  { name: "Arts", icon: Palette, color: "text-red-500" },
  { name: "Technology", icon: Cpu, color: "text-teal-500" },
  { name: "Science", icon: Atom, color: "text-sky-500" },
  { name: "Education", icon: BookOpen, color: "text-orange-500" },
];
