import React from "react";
import { useEffect, useState } from "react";

const baseUrl = "http://localhost:3000/api";

export default function SelectPatient() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const loadPatients = async () => {
      const res = await fetch(`${baseUrl}/all-patient`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setPatients(data);
    };

    loadPatients();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-medium mb-6">Select Existing Patient</h2>

      <div className="grid grid-cols-1 gap-4">
        {patients.map((p) => (
          <div
            key={p._id}
            className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => {
              localStorage.setItem("selectedPatient", JSON.stringify(p));
              window.location.href = "/recording";
            }}
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-gray-600 text-sm">DOB: {p.dob}</p>
            <p className="text-gray-600 text-sm">ID: {p.patientId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}