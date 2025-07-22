import type { GroupedCamp } from "@/utils/campUtils";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CampCard from "./CampCard";

interface CampListProps {
  title: string;
  description?: string;
  groupedCamps: GroupedCamp[];
  onCardClick: (camp: GroupedCamp) => void;
  className?: string;
  titleAlignment?: "left" | "center";
}

function CampList({
  title,
  description,
  groupedCamps,
  onCardClick,
  className = "",
  titleAlignment = "left",
}: CampListProps) {
  if (groupedCamps.length === 0) {
    return null;
  }

  const headerAlignmentClass = titleAlignment === "center" ? "text-center" : "";

  return (
    <section className={`py-16 ${className}`}>
      <div className="container">
        <div className={`mb-12 ${headerAlignmentClass}`}>
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          {description && (
            <p
              className={`mt-4 max-w-2xl text-muted-foreground text-lg ${titleAlignment === "center" ? "mx-auto" : ""}`}
            >
              {description}
            </p>
          )}
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="relative"
        >
          <CarouselContent className="-ml-1">
            {groupedCamps.map((camp, index) => (
              <CarouselItem
                key={index}
                className="pl-3 md:basis-1/2 lg:basis-1/4"
              >
                <div className="p-1">
                  <CampCard camp={camp} onClick={() => onCardClick(camp)} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-9 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-11 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
}

export default CampList;
