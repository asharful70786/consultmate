import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function ReviewNote() {
  const [params] = useSearchParams();
  const [patient, setPatient] = useState(null);

  const file = params.get("file");
  const pid = params.get("pid");

  console.log("Audio file:", file);
  console.log("Patient ID:", pid);

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await fetch(`${baseUrl}/patient/${pid}`, {
        credentials: "include",
      });

      const data = await res.json();
      setPatient(data);
    };

    fetchPatient();
  }, [pid]);

  return (
     <MainLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Review Clinical Note</h1>

      <p className="mt-4 text-gray-600">
        Audio File: <strong>{file}</strong>
      </p>

      {patient && (
        <p className="mt-2 text-gray-600">
          Patient: <strong>{patient.name}</strong>
        </p>
      )}

      {/* TODO: transcription + note generation here */}
    </div>
    </MainLayout>
  );
}
