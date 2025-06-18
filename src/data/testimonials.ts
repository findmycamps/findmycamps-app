// src/data/testimonials.ts
export interface Testimonial {
  name: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: "Sarah M.",
    quote:
      "FindMyCamps made it so easy to find the perfect arts camp for my daughter. She had an amazing summer and can't wait to go back!",
    rating: 5,
    avatar: "https://placehold.co/100x100/FFC0CB/000000?text=SM",
  },
  {
    name: "John B.",
    quote:
      "My son is obsessed with coding, and we found an incredible tech camp through this site. The filters helped us narrow it down quickly. Highly recommend!",
    rating: 5,
    avatar: "https://placehold.co/100x100/ADD8E6/000000?text=JB",
  },
  {
    name: "Linda P.",
    quote:
      "We were looking for an adventure camp in BC, and FindMyCamps had so many great options. The detailed descriptions and reviews were super helpful.",
    rating: 4,
    avatar: "https://placehold.co/100x100/90EE90/000000?text=LP",
  },
];
