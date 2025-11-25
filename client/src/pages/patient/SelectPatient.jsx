import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:3000/api";

export default function SelectPatient() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/all-patient`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    const name = p.name?.toLowerCase() || "";
    const pid = p.patientId?.toLowerCase() || "";

    return name.includes(term) || pid.includes(term);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading patient records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Records</h1>
        <p className="text-gray-600 text-sm">Select a patient to view details</p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or patient ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            {/* Patient Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {patient.name?.charAt(0) || "P"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                      {patient.name}
                    </h3>
                    <p className="text-gray-500 text-sm">ID: {patient.patientId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Details - Minimal Info */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="text-gray-900">
                  {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                </span>
              </div>
              
              {patient.gender && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-900 capitalize">{patient.gender}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => navigate(`/patient-details?id=${patient._id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200 text-center"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">👥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? "No patients found" : "No patients available"}
          </h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            {search 
              ? "No patients match your search criteria. Try adjusting your search terms."
              : "Get started by adding your first patient to the system."
            }
          </p>
          {!search && (
            <button
              onClick={() => navigate("/add-patient")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded text-sm font-medium transition-colors duration-200"
            >
              Add First Patient
            </button>
          )}
        </div>
      )}
    </div>
  );
}