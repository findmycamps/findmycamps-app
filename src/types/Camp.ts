export interface Camp {
  name: string;
  description: string;
  tags: string[];
  province: string;
  category: string;
  [key: string]: any; // Remove or refine as needed for more strict typing
}
