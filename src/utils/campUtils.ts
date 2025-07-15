import type { Camp } from "@/types/Camp";

// Define the structure for a session (a specific date/price combo)
export interface CampSession {
  campId: string;
  dates: {
    startDate: Date;
    endDate: Date;
  };
  price: number;
}

// Define the new structure for a grouped camp
export interface GroupedCamp extends Omit<Camp, "campId" | "dates" | "price"> {
  sessions: CampSession[];
}

// The grouping function
export function groupCamps(camps: Camp[]): GroupedCamp[] {
  const grouped = new Map<string, GroupedCamp>();

  camps.forEach((camp) => {
    const { campId, dates, price, ...commonDetails } = camp;
    const key = camp.name; // Use name as the primary key for grouping

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...commonDetails,
        sessions: [],
      });
    }

    // Add the specific date and price as a "session"
    grouped.get(key)!.sessions.push({
      campId,
      dates,
      price,
    });
  });

  return Array.from(grouped.values());
}
