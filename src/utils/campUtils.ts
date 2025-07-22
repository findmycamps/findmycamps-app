import type { Camp } from "@/types/Camp";

// Define the structure for a session, including its own location
export interface CampSession {
  campId: string;
  dates: {
    startDate: Date;
    endDate: Date;
  };
  price: number;
  location: {
    address: string;
    city: string;
    province: string;
  };
}

// GroupedCamp no longer needs its own top-level location
export interface GroupedCamp
  extends Omit<Camp, "campId" | "dates" | "price" | "location"> {
  sessions: CampSession[];
}

export function groupCamps(camps: Camp[]): GroupedCamp[] {
  const grouped = new Map<string, GroupedCamp>();

  camps.forEach((camp) => {
    // Return early if essential data is missing
    if (
      !camp.dates ||
      !camp.dates.startDate ||
      !camp.dates.endDate ||
      !camp.location
    ) {
      return;
    }

    // ✅ FIX 1: Capture 'location' during destructuring
    const { campId, dates, price, location, ...commonDetails } = camp;
    const key = camp.name;

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...commonDetails,
        sessions: [],
      });
    }

    const currentGroup = grouped.get(key)!;

    // Check for duplicate sessions to avoid visual clutter
    const isDuplicate = currentGroup.sessions.some(
      (session) =>
        session.dates.startDate.getTime() === dates.startDate.getTime() &&
        session.dates.endDate.getTime() === dates.endDate.getTime() &&
        session.price === price,
    );

    if (!isDuplicate) {
      // ✅ FIX 2: Pass the captured 'location' object into the session
      currentGroup.sessions.push({
        campId,
        dates,
        price,
        location, // Use the real location data
      });
    }
  });

  return Array.from(grouped.values());
}
