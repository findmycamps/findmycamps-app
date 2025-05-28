import React, { useState } from "react";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { PROVINCES } from "../data/mockCamps";

const SearchBar = ({ onSearch, onLocationChange, selectedLocation, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleLocationSelect = (provinceCode) => {
    onLocationChange(provinceCode);
    setIsLocationDropdownOpen(false);
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-xl my-8 md:my-12 transition-colors duration-300 ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="md:col-span-1">
          <label
            htmlFor="searchCamp"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Search Camp Name or Keyword
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            </div>
            <input
              type="text"
              id="searchCamp"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="e.g., 'Adventure Camp' or 'Coding'"
              className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500 placeholder-gray-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              }`}
            />
          </div>
        </div>
        <div className="relative md:col-span-1">
          <label
            htmlFor="location"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Location
          </label>
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className={`w-full flex items-center justify-between text-left px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-white hover:border-gray-500 focus:ring-indigo-500"
                : "bg-white border-gray-300 hover:border-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          >
            <MapPin
              className={`w-5 h-5 mr-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
            />
            <span className="flex-grow">
              {PROVINCES.find((p) => p.code === selectedLocation)?.name ||
                "Select Province"}
            </span>
            {isLocationDropdownOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {isLocationDropdownOpen && (
            <div
              className={`absolute z-20 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-300 origin-top ${
                darkMode ? "bg-gray-800 border border-gray-600" : "bg-white border border-gray-200"
              }`}
            >
              {PROVINCES.map((province) => (
                <div
                  key={province.code}
                  onClick={() => handleLocationSelect(province.code)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  {province.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
