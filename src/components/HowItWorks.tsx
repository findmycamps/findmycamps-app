import React from "react";
import { Search, CheckCircle, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover & Filter",
    description:
      "Use our powerful search and filtering tools to find camps that match your needs.",
  },
  {
    icon: CheckCircle,
    title: "Compare & Choose",
    description:
      "Easily compare details, dates, and prices to select the perfect camp experience.",
  },
  {
    icon: Heart,
    title: "Register & Enjoy",
    description:
      "Connect directly to the camp's website to register and get ready for an amazing adventure.",
  },
];

function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
          Finding the right camp is as easy as 1, 2, 3.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
