import type { GroupedCamp } from "@/utils/campUtils";
import React from "react";
import {
  ArrowLeftCircle,
  Star,
  Tag,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

interface CampProfilePageProps {
  camp: GroupedCamp;
  onBack: () => void;
  darkMode: boolean;
}

function CampProfilePage({ camp, onBack, darkMode }: CampProfilePageProps) {
  const imageUrl =
    camp.image || "https://placehold.co/1200x600?text=FindMyCamps";
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "N/A";
    // Ensure the input is a Date object before formatting
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="container mx-auto p-4 md:p-8">
      <button
        onClick={onBack}
        className="flex items-center mb-6 text-indigo-600 hover:underline"
      >
        <ArrowLeftCircle className="w-6 h-6 mr-2" />
        Back to All Camps
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={imageUrl}
            alt={camp.name}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="mt-8">
            <h1 className="text-4xl font-bold">{camp.name}</h1>
            <p className="mt-4 text-lg">{camp.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">
              Camp Details
            </h2>

            <div className="space-y-4">
              <h3 className="flex items-center font-semibold">
                <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                Available Sessions
              </h3>
              <div className="space-y-3 pl-2">
                {camp.sessions.map((session) => (
                  <div
                    key={session.campId}
                    className={`p-3 rounded-md border ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
                  >
                    <p className="font-semibold">
                      {formatDate(session.dates.startDate)} –{" "}
                      {formatDate(session.dates.endDate)}
                    </p>
                    <p className="text-lg font-bold text-yellow-500 mt-1">
                      ${session.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span>{camp.location.address}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-green-500" />
                <span>Ages: {camp.ageRange}</span>
              </div>
              {camp.tags.length > 0 && (
                <div className="flex items-start">
                  <Tag className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {camp.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-xs rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {camp.camplink && (
              <a
                href={camp.camplink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center w-full text-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Register on Camp Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampProfilePage;
