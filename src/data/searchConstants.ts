// data/searchConstants.ts
export const AGE_GROUPS = [
  "4-6 years",
  "7-9 years", 
  "10-13 years",
  "14-17 years",
  "18+ years"
];

export const PRICE_RANGES = [
  { label: "Any Price", value: "0-1000", range: [0, 1000] as [number, number] },
  { label: "Under $200", value: "0-200", range: [0, 200] as [number, number] },
  { label: "$200 - $400", value: "200-400", range: [200, 400] as [number, number] },
  { label: "$400 - $600", value: "400-600", range: [400, 600] as [number, number] },
  { label: "$600 - $800", value: "600-800", range: [600, 800] as [number, number] },
  { label: "$800+", value: "800-1000", range: [800, 1000] as [number, number] },
];
