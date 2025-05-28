import React from "react";
import { Search, Users, BookOpen } from "lucide-react";

const HowItWorks = ({ darkMode }) => {
  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description:
        "Browse hundreds of camps or use filters to find the perfect match for your child's interests and your family's needs.",
      color: darkMode ? "text-blue-400" : "text-blue-600",
    },
    {
      icon: Users,
      title: "Compare & Choose",
      description:
        "Read detailed descriptions, check camp schedules, and compare options side-by-side to make an informed decision.",
      color: darkMode ? "text-green-400" : "text-green-600",
    },
    {
      icon: BookOpen,
      title: "Book & Get Ready!",
      description:
        "Easily book your child's spot through our platform (or partner links) and prepare for an unforgettable summer experience.",
      color: darkMode ? "text-purple-400" : "text-purple-600",
    },
  ];

  return (
    <section className={`py-12 md:py-16 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <div className="container mx-auto px-6">
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-4 text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          How FindMyCamps Works
        </h2>
        <p
          className={`text-center text-sm sm:text-base mb-10 md:mb-12 max-w-2xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Finding the perfect summer camp is as easy as 1-2-3!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 text-center ${
                  darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:shadow-xl"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${
                    darkMode ? "bg-gray-600" : "bg-indigo-100"
                  }`}
                >
                  <IconComponent className={`w-10 h-10 ${step.color}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
