export interface Tier {
  tierId: string; // e.g., 'basic', 'pro', 'enterprise'
  name: string; // e.g., "Basic Plan", "Pro Plan"
  description: string;
  priceMonthly: number;
  priceYearly?: number; // Optional, for annual discount
  features: string[]; // List of feature keys like 'viewInsights', 'boostCamp'
  visibility: boolean; // Controls if the tier is publicly visible
  rank: number; // For sorting tiers in the UI (e.g., 0=free, 1=pro)
  createdAt: Date; // Or Firestore.Timestamp
}
