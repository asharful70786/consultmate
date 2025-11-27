import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function ReviewNote() {
  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const [patient, setPatient] = useState(null);
  const [note, setNote] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  // Single DB call
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`${baseUrl}/review/${noteId}`, {
        credentials: "include",
      });

      const data = await res.json();

      setPatient(data.patient);
      setNote(data.note);

      setEditedNote(data.note.structuredNote);
    }

    loadData();
  }, [noteId]);

  if (!note || !patient) {
    return (
      <MainLayout>
        <div className="p-6">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">Review Clinical Note</h1>

        {/* Patient Info */}
        <div className="text-gray-700">
          <p><strong>Patient:</strong> {patient.name}</p>
          <p><strong>DOB:</strong> {patient.dob}</p>
          <p><strong>Patient ID:</strong> {patient._id}</p>
        </div>

        {/* Key Points */}
        <div>
          <h2 className="text-xl font-semibold">Key Points</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(note.keyPoints, null, 2)}
          </pre>
        </div>

        {/* Editable Structured Note */}
        <div>
          <h2 className="text-xl font-semibold mt-4">Structured Note</h2>
          <textarea
            className="w-full h-64 p-4 border rounded text-sm"
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
          />
        </div>

        {/* Transcript */}
        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600">
            Show Transcript
          </summary>
          <p className="mt-3 p-4 bg-gray-50 rounded whitespace-pre-line text-sm">
            {note.transcript}
          </p>
        </details>

      </div>
    </MainLayout>
  );
}
