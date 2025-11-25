import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        Patient Management
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/add-patient")}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          ➕ Add New Patient
        </button>

        <button
          onClick={() => navigate("/select-patient")}
          className="px-8 py-4 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          📁 Select Existing Patient
        </button>
      </div>
    </div>
  );
}
