import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Camp } from "@/types/Camp";

interface BatchResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
  totalCost: number;
}

export async function batchGenerateImagesForAllCamps(): Promise<BatchResult> {
  const result: BatchResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
    totalCost: 0,
  };

  try {
    const campsCollection = collection(db, "camps");
    const snapshot = await getDocs(campsCollection);

    console.log(
      `🚀 Starting FREE automated generation for ${snapshot.docs.length} camps...`,
    );

    for (const docSnap of snapshot.docs) {
      const camp = { id: docSnap.id, ...docSnap.data() } as Camp & {
        id: string;
      };

      //   // Skip if already has an image
      //   if (camp.image) {
      //     console.log(`⏭️ Skipping ${camp.name} - already has image`);
      //     result.skipped++;
      //     continue;
      //   }

      // Skip if missing required data
      if (!camp.name || !camp.ageRange) {
        console.log(`⚠️ Skipping ${camp.name} - missing name or age range`);
        result.skipped++;
        continue;
      }

      try {
        console.log(
          `🎨 Processing: ${camp.name} (Ages: ${camp.ageRange}) - FREE!`,
        );

        const response = await fetch("/api/generate-camp-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campId: camp.id,
            campName: camp.name,
            ageRange: camp.ageRange,
            tags: camp.tags || [],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success: ${camp.name} - Cost: $0.00`);
          result.success++;
        } else {
          const error = await response.text();
          console.error(`❌ Failed: ${camp.name} - ${error}`);
          result.errors.push(`${camp.name}: ${error}`);
          result.failed++;
        }

        // Rate limiting - wait 3 seconds between requests
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ Error generating image for ${camp.name}:`, error);
        result.errors.push(`${camp.name}: ${error}`);
        result.failed++;
      }
    }

    console.log(`🎉 FREE batch generation complete!`);
    console.log(`✅ Success: ${result.success}`);
    console.log(`❌ Failed: ${result.failed}`);
    console.log(`⏭️ Skipped: ${result.skipped}`);
    console.log(`💰 Total Cost: $0.00 (COMPLETELY FREE!)`);

    return result;
  } catch (error) {
    console.error("❌ Batch generation failed:", error);
    throw error;
  }
}
