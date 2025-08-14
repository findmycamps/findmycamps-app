import {
  Compass,
  TentTree,
  Trophy,
  Palette,
  Cpu,
  Atom,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string; // ✅ New property for background colors
}

export interface Province {
  code: string;
  name: string;
}

export const CATEGORIES_WITH_ICONS: Category[] = [
  {
    name: "All",
    icon: Compass,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Adventure",
    icon: TentTree,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Sports",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    name: "Arts",
    icon: Palette,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    name: "Technology",
    icon: Cpu,
    color: "text-teal-500",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    name: "Science",
    icon: Atom,
    color: "text-sky-500",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
  },
  {
    name: "Education",
    icon: BookOpen,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
];

export const PROVINCES: Province[] = [
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
