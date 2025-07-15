import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed
import campDataRaw from "../data/campdata.json";
import { Camp } from "../types/Camp";

// Convert date strings to Date objects if necessary
const campData = (campDataRaw as any[]).map((camp) => {
  if (camp.dates) {
    if (typeof camp.dates.startDate === "string") {
      camp.dates.startDate = new Date(camp.dates.startDate);
    }
    if (typeof camp.dates.endDate === "string") {
      camp.dates.endDate = new Date(camp.dates.endDate);
    }
  }
  if (camp.createdAt && typeof camp.createdAt === "string") {
    camp.createdAt = new Date(camp.createdAt);
  }
  return camp as Camp;
});

export const seedCampsToFirestore = async () => {
  const campsCollectionRef = collection(db, "camps");
  console.log("Seeding camps...");

  for (const camp of campData) {
    const campDocRef = doc(campsCollectionRef, camp.campId);
    try {
      await setDoc(campDocRef, {
        ...camp,
        createdAt: camp.createdAt || new Date(),
      });
      console.log(`✅ Seeded camp: ${camp.name}`);
    } catch (e) {
      console.error(`❌ Failed to seed camp: ${camp.name}`, e);
    }
  }

  console.log("🎉 All camps seeded!");
};
