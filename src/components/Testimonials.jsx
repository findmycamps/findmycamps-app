import React from "react";
import { Star } from "lucide-react";

const TESTIMONIALS_DATA = [
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

const Testimonials = ({ darkMode }) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-4 text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          What Parents Say
        </h2>
        <p
          className={`text-center text-sm sm:text-base mb-10 md:mb-12 max-w-2xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Hear from parents who found amazing summer experiences for their kids.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-700"
              }`}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/100x100/${
                      darkMode ? "4B5563" : "E5E7EB"
                    }/${darkMode ? "F3F4F6" : "4B5563"}?text=??`;
                  }}
                />
                <div>
                  <h4
                    className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {testimonial.name}
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : darkMode
                              ? "text-gray-600"
                              : "text-gray-300"
                        }`}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
