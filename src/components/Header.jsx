import React from "react";
import { Smile, Sun, Moon, UserCircle } from "lucide-react";

const Header = ({ darkMode, toggleDarkMode, onLoginClick }) => (
  <header
    className={`py-4 shadow-md sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
    }`}
  >
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Smile
          className={`w-8 h-8 ${darkMode ? "text-yellow-300" : "text-yellow-400"}`}
        />
        <h1 className="text-2xl font-bold tracking-tight">FindMyCamps</h1>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors duration-300 ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          )}
        </button>
        <button
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ease-in-out whitespace-nowrap ${
            darkMode
              ? "bg-indigo-500 hover:bg-indigo-400 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105`}
        >
          List a Camp
        </button>
        <button
          onClick={onLoginClick}
          className={`flex items-center px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ease-in-out whitespace-nowrap ${
            darkMode
              ? "bg-green-500 hover:bg-green-400 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105`}
        >
          <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Login
        </button>
      </div>
    </div>
  </header>
);

export default Header;
