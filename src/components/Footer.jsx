import React from "react";

const Footer = ({ darkMode }) => (
  <footer
    className={`py-8 mt-12 md:mt-16 border-t ${
      darkMode ? "border-gray-700 bg-gray-800 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-500"
    }`}
  >
    <div className="container mx-auto px-6 text-center">
      <p>&copy; {new Date().getFullYear()} FindMyCamps. All rights reserved.</p>
      <p className="text-sm mt-1">Helping parents find the best summer experiences for their kids.</p>
    </div>
  </footer>
);

export default Footer;
