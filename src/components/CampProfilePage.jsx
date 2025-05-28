import React from "react";
import { ArrowLeftCircle, Star, Tag, MapPin, Users, DollarSign } from "lucide-react";

const CampProfilePage = ({ camp, onBack, darkMode }) => (
  <div
    className={`container mx-auto max-w-3xl py-10 px-4 ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    } rounded-xl shadow-lg mt-10`}
  >
    <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 hover:underline">
      <ArrowLeftCircle className="w-5 h-5 mr-2" /> Back to Camps
    </button>
    <img src={camp.imageUrl} alt={camp.name} className="w-full rounded-xl h-60 object-cover mb-4 shadow" />
    <h2 className="text-3xl font-bold mb-2">{camp.name}</h2>
    <div className="flex items-center space-x-3 mb-3">
      <Star className="text-yellow-400" /> <span className="font-semibold">{camp.rating}</span>
      <Tag className="ml-4 text-indigo-400" /> <span>{camp.category}</span>
    </div>
    <div className="mb-4 text-sm">
      <span className="mr-4">
        <MapPin className="inline w-4 h-4" /> {camp.city}, {camp.province}
      </span>
      <span className="mr-4">
        <Users className="inline w-4 h-4" /> Ages {camp.ageRange}
      </span>
      <span>
        <DollarSign className="inline w-4 h-4" /> C${camp.price}/week
      </span>
    </div>
    <p className="mb-6">{camp.description}</p>
    <div className="flex gap-2">
      {camp.tags.map((tag) => (
        <span key={tag} className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default CampProfilePage;
