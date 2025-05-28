import React, { useState } from "react";

const defaultKid = {
  name: "",
  age: "",
  activities: [],
  date: "",
  time: "",
  locationSameAsUser: true,
  address: "",
  province: "",
  postalCode: ""
};

const SignUpModal = ({ onClose, darkMode }) => {
  const [step, setStep] = useState(1);

  // Step 1: User Info
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    province: "",
    postalCode: ""
  });

  // Step 2: Kids Info
  const [kids, setKids] = useState([]);

  const handleAddKid = () => setKids([...kids, { ...defaultKid }]);

  const handleKidChange = (index, field, value) => {
    const updatedKids = [...kids];
    updatedKids[index][field] = value;

    if (field === "locationSameAsUser" && value) {
      updatedKids[index].address = userInfo.address;
      updatedKids[index].province = userInfo.province;
      updatedKids[index].postalCode = userInfo.postalCode;
    }

    setKids(updatedKids);
  };

  const handleSubmit = () => {
    console.log("User Info:", userInfo);
    console.log("Kids Info:", kids);
    alert("Registration submitted!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className={`bg-white ${darkMode ? "dark:bg-gray-800 text-white" : "text-gray-900"} p-6 rounded-xl w-full max-w-xl shadow-lg relative`}>
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>

        {/* Step Header */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mx-2 font-semibold ${step === s ? "bg-indigo-600 text-white" : "border-gray-400 text-gray-500"}`}>
              {s}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            {["email", "password", "firstName", "lastName", "phone", "address", "province", "postalCode"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={userInfo[field]}
                onChange={(e) => setUserInfo({ ...userInfo, [field]: e.target.value })}
                className="w-full mb-2 p-3 border rounded-md"
              />
            ))}
            <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 mt-2">
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Kids (optional)</h2>
            {kids.map((kid, idx) => (
              <div key={idx} className="border rounded p-3 mb-4 space-y-2">
                <input placeholder="Kid's Name" value={kid.name} onChange={(e) => handleKidChange(idx, "name", e.target.value)} className="w-full p-2 border rounded" />
                <input placeholder="Age" value={kid.age} onChange={(e) => handleKidChange(idx, "age", e.target.value)} className="w-full p-2 border rounded" />
                <input placeholder="Activity Preferences (comma-separated)" value={kid.activities.join(", ")} onChange={(e) => handleKidChange(idx, "activities", e.target.value.split(",").map(a => a.trim()))} className="w-full p-2 border rounded" />
                <input type="date" value={kid.date} onChange={(e) => handleKidChange(idx, "date", e.target.value)} className="w-full p-2 border rounded" />
                <input type="time" value={kid.time} onChange={(e) => handleKidChange(idx, "time", e.target.value)} className="w-full p-2 border rounded" />

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={kid.locationSameAsUser}
                    onChange={(e) => handleKidChange(idx, "locationSameAsUser", e.target.checked)}
                  />
                  <span>Same as your address</span>
                </label>

                {!kid.locationSameAsUser && (
                  <>
                    <input placeholder="Address" value={kid.address} onChange={(e) => handleKidChange(idx, "address", e.target.value)} className="w-full p-2 border rounded" />
                    <input placeholder="Province" value={kid.province} onChange={(e) => handleKidChange(idx, "province", e.target.value)} className="w-full p-2 border rounded" />
                    <input placeholder="Postal Code" value={kid.postalCode} onChange={(e) => handleKidChange(idx, "postalCode", e.target.value)} className="w-full p-2 border rounded" />
                  </>
                )}
              </div>
            ))}
            <button onClick={handleAddKid} className="w-full bg-gray-200 text-gray-800 py-2 rounded-md mb-2">
              + Add Another Kid
            </button>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Back</button>
              <button onClick={() => setStep(3)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Next</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Information</h2>
            <pre className="text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 p-3 rounded max-h-64 overflow-auto">
              {JSON.stringify({ userInfo, kids }, null, 2)}
            </pre>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Back</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Confirm & Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;
