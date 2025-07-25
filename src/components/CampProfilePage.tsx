import type { GroupedCamp, CampSession } from "@/utils/campUtils";
import React from "react";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES_WITH_ICONS } from "../data/constants";

interface CampProfilePageProps {
  camp: GroupedCamp;
  onBack: () => void;
}

const CampThumbnail = ({ camp }: { camp: GroupedCamp }) => {
  const categoryInfo = CATEGORIES_WITH_ICONS.find(
    (c) => c.name.toLowerCase() === camp.category?.toLowerCase(),
  );
  const Icon = categoryInfo?.icon || Sparkles;
  const bgColor = categoryInfo?.bgColor || "bg-muted";

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-2xl ${bgColor}`}
    >
      <Icon className="h-24 w-24 text-foreground/50" />
    </div>
  );
};

function CampProfilePage({ camp, onBack }: CampProfilePageProps) {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-screen-lg py-8 md:py-12">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-semibold text-foreground hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all camps
        </button>

        {/* ✅ ROW 1: Conditional Image or Thumbnail */}
        <div className="w-full h-96 overflow-hidden rounded-2xl shadow-md mb-8">
          {camp.image ? (
            <img
              src={camp.image}
              alt={`Image of ${camp.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <CampThumbnail camp={camp} />
          )}
        </div>

        {/* ROW 2: Two-column layout for details */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
          {/* -- LEFT COLUMN: Main Content -- */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {camp.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {camp.description}
            </p>

            <Separator className="my-8" />

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-3 text-muted-foreground" />
                Activities & Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {camp.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-sm font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* -- RIGHT COLUMN: Sticky Details Card -- */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24">
              <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    ${camp.sessions?.[0]?.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      {" "}
                      / week
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold flex items-center mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      Available Dates
                    </h4>
                    <div className="space-y-3">
                      {camp.sessions.map((session) => (
                        <div
                          key={session.campId}
                          className="p-3 rounded-lg border border-border"
                        >
                          <p className="font-semibold text-sm">
                            {new Date(
                              session.dates.startDate,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            –
                            {new Date(session.dates.endDate).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric" },
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                            <MapPin className="w-3 h-3" />
                            {session.location.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold">Ages: {camp.ageRange}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold">
                        {camp.sessions?.[0]?.location.city},{" "}
                        {camp.sessions?.[0]?.location.province}
                      </p>
                    </div>
                  </div>

                  <a
                    href={camp.camplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full font-bold text-lg">
                      Register
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default CampProfilePage;
