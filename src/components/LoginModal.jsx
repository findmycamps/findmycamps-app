import React, { useState } from "react";
import ResetPasswordModal from "./ResetPasswordModal";

const LoginModal = ({ onClose, darkMode }) => {
  const [showReset, setShowReset] = useState(false);

  if (showReset) {
    return <ResetPasswordModal onClose={() => setShowReset(false)} darkMode={darkMode} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white ${darkMode ? "dark:bg-gray-800 text-white" : "text-gray-900"} p-6 rounded-xl w-full max-w-sm shadow-lg relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded-md"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
          Sign In
        </button>
        <div className="text-sm mt-4 text-center text-gray-500">
          <button onClick={() => setShowReset(true)} className="underline">Forgot password?</button> |{" "}
          <button className="underline">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
