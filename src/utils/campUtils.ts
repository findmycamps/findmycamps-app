import type { Camp } from "@/types/Camp";

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

export interface GroupedCamp
  extends Omit<Camp, "campId" | "dates" | "price" | "location"> {
  sessions: CampSession[];
}

export function groupCamps(camps: Camp[]): GroupedCamp[] {
  const grouped = new Map<string, GroupedCamp>();

  camps.forEach((camp) => {
    if (!camp.dates || !camp.dates.startDate || !camp.dates.endDate) {
      return;
    }

    const { campId, dates, price, location, ...commonDetails } = camp;
    const key = camp.name;

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...commonDetails,
        sessions: [],
      });
    }

    const currentGroup = grouped.get(key)!;

    const isDuplicate = currentGroup.sessions.some(
      (session) =>
        session.dates.startDate.getTime() === dates.startDate.getTime() &&
        session.dates.endDate.getTime() === dates.endDate.getTime() &&
        session.price === price,
    );

    if (!isDuplicate) {
      currentGroup.sessions.push({
        campId,
        dates,
        price,
        location,
      });
    }
  });

  return Array.from(grouped.values());
}
