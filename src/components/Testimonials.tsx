import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "FindMyCamps made our summer planning a breeze! We found an amazing arts camp that our daughter absolutely loved.",
    author: "Sarah J.",
    location: "Vancouver, BC",
  },
  {
    quote:
      "The detailed filtering and comparison tools are a game-changer. We'll be using this every year.",
    author: "Michael R.",
    location: "Toronto, ON",
  },
  {
    quote:
      "I can't believe how easy it was to find a camp that fit our budget and schedule. Highly recommended!",
    author: "Emily T.",
    location: "Calgary, AB",
  },
];

function Testimonials() {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          What Parents Are Saying
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-card rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-golden-amber fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "{testimonial.quote}"
              </p>
              <p className="mt-4 font-semibold text-foreground">
                - {testimonial.author}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonial.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
