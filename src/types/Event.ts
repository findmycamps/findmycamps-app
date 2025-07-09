// A suggested interface for the optional meta object
export interface EventMeta {
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: {
    city: string;
    province: string;
    country: string;
  };
  // Add any other relevant metadata you want to track
  [key: string]: any;
}

export interface Event {
  eventId: string; // Unique ID for the event log
  userId: string; // ID of the user who triggered the event
  campId?: string; // Optional: The camp associated with the event
  eventType:
    | "clicked"
    | "saved"
    | "redirected"
    | "inquired"
    | "pageView"
    | "search";
  timestamp: Date; // Or Firestore.Timestamp if using server-side
  meta?: EventMeta; // Optional metadata
}
