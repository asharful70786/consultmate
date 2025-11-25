import React from "react";
import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">
          🏥 ConsultMate
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700">
          <button
            onClick={() => navigate("/")}
            className="text-left px-4 py-2 hover:bg-blue-50 rounded-lg"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/add-patient")}
            className="text-left px-4 py-2 hover:bg-blue-50 rounded-lg"
          >
            ➕ Add Patient
          </button>

          <button
            onClick={() => navigate("/select-patient")}
            className="text-left px-4 py-2 hover:bg-blue-50 rounded-lg"
          >
            📁 Select Patient
          </button>

          <button
            onClick={() => navigate("/logout")}
            className="text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main View */}
      <main className="flex-1 p-12">{children}</main>
    </div>
  );
}
