import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordingComponent from "../../components/Recording";

const baseUrl = "http://localhost:3000/api";

export default function PatientDetails() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/patient/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error("Error loading patient:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Patient not found.</p>
        <button
          onClick={() => navigate("/select-patient")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          <button
            onClick={() => navigate("/select-patient")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm"
          >
            ← Back to Patients
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Patient Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">
                    {patient.name?.charAt(0) || "P"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {patient.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Patient ID: {patient.patientId}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 mt-1">
                    {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                  </p>
                </div>

                {patient.gender && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {patient.gender}
                    </p>
                  </div>
                )}

                {patient.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900 mt-1">{patient.phone}</p>
                  </div>
                )}

                {patient.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{patient.email}</p>
                  </div>
                )}
              </div>

              {patient.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900 mt-1">{patient.address}</p>
                </div>
              )}

               {patient.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    NoteId 
                  </label>
                  <ul className="text-gray-900 mt-1 space-y-1">
  {patient.notes.map((noteId) => (
    <li key={noteId}>
      <a
        href={`/note-details?noteId=${noteId}`}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {noteId}
      </a>
    </li>
  ))}
</ul>

                </div>
              )}


              {patient.medicalHistory && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Medical History
                  </label>
                  <p className="text-gray-900 mt-1">{patient.medicalHistory}</p>
                </div>
              )}

              {patient.allergies && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Allergies
                  </label>
                  <p className="text-gray-900 mt-1">{patient.allergies}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recording Card */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consultation Recording
            </h3>

            <RecordingComponent patient={patient} />
          </div>
        </div>
      </div>
    </div>
  );
}
