import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed
import { Camp } from "../types/Camp";

export function useCamps() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "camps"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const campsData = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;

          // ✅ Remap categories here
          let category = data.category;
          if (category === "General") {
            category = "Arts";
          } else if (category === "STEAM" || category === "STEM") {
            category = "Science";
          } else if (category === "Support" || category === "Leadership") {
            category = "Education";
          }
          // Convert Firestore Timestamps back to JS Dates
          const camp: Camp = {
            ...data,
            category: category,
            createdAt: (data.createdAt as Timestamp)?.toDate(),
            // Add conversions for any other timestamp fields if necessary
            dates: {
              startDate: (data.dates?.startDate as Timestamp)?.toDate(),
              endDate: (data.dates?.endDate as Timestamp)?.toDate(),
            },
          } as Camp;
          return camp;
        });

        setCamps(campsData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching camps:", err);
      },
    );

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return { camps, loading, error };
}
