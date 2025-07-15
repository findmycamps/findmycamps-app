// An interface for legal documents, used within the CampOwner type
export interface LegalDocument {
  name: string;
  url: string; // URL to the stored document in Firebase Storage
  type: "license" | "insurance" | "certification" | "other";
  uploadedAt: Date;
}

export interface CampOwner {
  ownerId: string;
  fullName: string;
  email: string;
  phone: string;
  organizationName?: string;
  linkedCamps: string[]; // Array of campIds
  role: "admin" | "staff" | "editor";
  tierId: string; // e.g., 'free', 'premium'

  // --- Consolidated Status Field ---
  status: "pending_verification" | "active" | "suspended" | "rejected";

  // --- Optional for MVP ---
  documents?: LegalDocument[];
  createdAt?: Date;
  lastLogin?: Date;
}
