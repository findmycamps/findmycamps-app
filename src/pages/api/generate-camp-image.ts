// pages/api/generate-camp-image.ts (FIXED)
import { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { campId, campName, ageRange, tags } = req.body;

  if (!campId || !campName || !ageRange) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log(
      `🎨 Generating FREE image for: ${campName} (Ages: ${ageRange})`,
    );

    // Step 1: Generate image with Cloudflare Workers AI (FREE!)
    const prompt = generatePromptForCamp(campName, ageRange, tags);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cloudflare API error: ${response.status} - ${errorText}`,
      );
    }

    // Step 2: Handle the response - Cloudflare returns the image directly as binary data
    const imageBuffer = await response.arrayBuffer();

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      throw new Error("No image data returned from Cloudflare AI");
    }

    console.log(`📥 Received image data: ${imageBuffer.byteLength} bytes`);

    // Step 3: Upload to Firebase Storage
    console.log(`☁️ Uploading to Firebase Storage...`);
    const fileName = `camp-images/${campId}-${Date.now()}.png`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, imageBuffer, {
      contentType: "image/png",
      customMetadata: {
        campName: campName,
        generatedAt: new Date().toISOString(),
        prompt: prompt,
        generator: "cloudflare-workers-ai",
      },
    });

    // Step 4: Get permanent download URL
    const permanentUrl = await getDownloadURL(storageRef);

    // Step 5: Update Firestore with permanent URL
    console.log(`💾 Updating Firestore...`);
    const campRef = doc(db, "camps", campId);
    await updateDoc(campRef, {
      image: permanentUrl,
      imageGeneratedAt: new Date(),
      imagePrompt: prompt,
    });

    console.log(`✅ FREE image generated and stored for: ${campName}`);

    res.status(200).json({
      success: true,
      imageUrl: permanentUrl,
      prompt: prompt,
      campId: campId,
      cost: "$0.00",
    });
  } catch (error) {
    console.error(`❌ Failed to generate image for ${campName}:`, error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function generatePromptForCamp(
  campName: string,
  ageRange: string,
  tags?: string[],
): string {
  // Extract key activities from camp name
  const nameActivities = extractActivitiesFromName(campName);

  // Combine activities from name and tags
  const allActivities = [...nameActivities];
  if (tags && tags.length > 0) {
    allActivities.push(...tags);
  }

  // Remove duplicates and clean up
  const uniqueActivities = [...new Set(allActivities)].filter(
    (activity) => activity && activity.trim().length > 0,
  );

  const activitiesText =
    uniqueActivities.length > 0
      ? uniqueActivities.join(", ")
      : "camp activities";

  return `Professional photograph of diverse children ages ${ageRange} at ${campName}. Focus prominently on these activities ${activitiesText}. Show kids actively engaged with these activities. Include clear visual elements that represent the camp's focus. High-quality warm tone, photorealistic image with 4:3 aspect ratio suitable for website thumbnails.`;
}

function extractActivitiesFromName(campName: string): string[] {
  const name = campName.toLowerCase();
  const activities: string[] = [];

  // Activity mappings - add more as needed
  const activityMappings = {
    bike: ["bicycles", "cycling", "bike riding"],
    cycling: ["bicycles", "bike riding"],
    coding: ["computers", "laptops", "programming", "software development"],
    minecraft: ["minecraft game", "computer gaming", "block building"],
    robotics: ["robots", "programming", "STEM equipment"],
    art: ["painting", "drawing", "art supplies", "paintbrushes", "canvases"],
    crafts: ["painting", "drawing", "art supplies", "paintbrushes", "canvases"],
    music: ["musical instruments", "singing", "performance"],
    dance: ["dancing", "choreography", "movement"],
    soccer: ["soccer balls", "football", "sports equipment"],
    basketball: ["basketballs", "basketball court", "sports"],
    tennis: ["tennis rackets", "tennis balls", "tennis court"],
    swimming: ["swimming pool", "water activities", "swim gear"],
    cooking: ["kitchen equipment", "cooking utensils", "food preparation"],
    science: ["laboratory equipment", "experiments", "STEM activities"],
    drama: ["theater", "acting", "costumes", "stage performance"],
    photography: ["cameras", "photo equipment", "picture taking"],
    skateboard: ["skateboards", "skating", "ramps"],
    adventure: ["outdoor gear", "hiking equipment", "nature exploration"],
    lego: ["lego blocks", "building", "construction"],
    gaming: ["video games", "gaming equipment", "esports"],
    stem: ["science equipment", "technology", "engineering tools"],
    steam: ["science equipment", "technology", "engineering tools"],
    maker: ["building tools", "crafting materials", "DIY projects"],
  };

  // Check camp name for activity keywords
  for (const [keyword, mappedActivities] of Object.entries(activityMappings)) {
    if (name.includes(keyword)) {
      activities.push(...mappedActivities);
    }
  }

  // If no specific activities found, extract general words
  if (activities.length === 0) {
    const words = name
      .split(/[\s,-]+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            "camp",
            "kids",
            "youth",
            "junior",
            "senior",
            "half",
            "full",
            "day",
          ].includes(word),
      );
    activities.push(...words);
  }

  return activities;
}
