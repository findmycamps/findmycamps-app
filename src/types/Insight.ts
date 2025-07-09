export interface Insight {
  insightId: string; // Unique ID for the insight record
  campId: string; // ID of the camp being tracked
  userId?: string; // ID of the user who interacted (optional for anonymous users)

  // Engagement Metrics
  views: number;
  clicks: number;
  saves: number;
  redirects: number; // Clicks on the external camp link
  inquiries: number;

  // Optional Calculated Metrics
  expectedRevenue?: number;

  // Timestamps
  createdAt: Date; // When the insight record was created
  lastUpdatedAt: Date; // When any metric was last updated
}
