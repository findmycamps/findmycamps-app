import React, { useState } from "react";

const ResetPasswordModal = ({ onClose, darkMode }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);

    // Simulate sending email (replace with backend call)
    setTimeout(() => {
      // Optionally close after delay: setTimeout(onClose, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white ${darkMode ? "dark:bg-gray-800 text-white" : "text-gray-900"} p-6 rounded-xl w-full max-w-sm shadow-lg relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2 text-center">Reset your password</h2>
        {!submitted ? (
          <>
            <p className="text-sm text-center mb-4">
              Enter your email or username and we’ll send you a link to reset your password.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or username"
              className="w-full mb-2 p-3 border rounded-md"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleReset}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Reset password
            </button>
            <p className="text-sm text-center mt-4 text-blue-600 underline cursor-pointer">
              Need help?
            </p>
          </>
        ) : (
          <p className="text-center text-green-600 text-sm">
            ✅ A password reset link has been sent to <strong>{email}</strong>.
            <br />
            Please check your inbox.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
