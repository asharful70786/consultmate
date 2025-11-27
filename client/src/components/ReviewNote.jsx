import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function ReviewNote() {
  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const [note, setNote] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the draft note
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`${baseUrl}/review/${noteId}`, {
        credentials: "include",
      });

      const data = await res.json();
      setNote(data);

      // structuredNote is a STRING
      setEditedNote(data.structuredNote);
    }

    loadData();
  }, [noteId]);

  if (!note) {
    return (
      <MainLayout>
        <div className="p-6">Loading...</div>
      </MainLayout>
    );
  }

  // --- APPROVE FINAL NOTE ---
  const handleApproveFinal = async () => {
    setLoading(true);

    const res = await fetch(`${baseUrl}/finalize/${noteId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: note.patientId,
        structuredNote: editedNote,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.status === 200) {
      alert("Final note approved.");
      // update UI state so editor disappears
      setNote({ ...note, status: "approved" });
    } else {
      alert(data.error || "Error approving note");
    }
  };

  // --- COPY BUTTON ---
  const handleCopy = () => {
    navigator.clipboard.writeText(editedNote);
    alert("Copied to clipboard!");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Review Clinical Note</h1>

        {/* BASIC INFO */}
        <div className="text-gray-700">
          <p><strong>Note ID:</strong> {note._id}</p>
          <p><strong>Patient ID:</strong> {note.patientId}</p>
          <p><strong>Status:</strong> {note.status}</p>
        </div>

        {/* STATUS BANNER */}
        {note.status === "approved" && (
          <div className="p-3 bg-green-100 border border-green-300 rounded text-green-800">
            This note has already been approved. Editing is disabled.
          </div>
        )}

        {/* KEY POINTS */}
        <div>
          <h2 className="text-xl font-semibold">Key Points</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(note.keyPoints, null, 2)}
          </pre>
        </div>

        {/* STRUCTURED NOTE */}
        <div>
          <h2 className="text-xl font-semibold mt-4">Structured Note</h2>

          <textarea
            className="w-full h-64 p-4 border rounded text-sm"
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            disabled={note.status === "approved"}
          />

          {/* BUTTONS BASED ON STATUS */}
          <div className="flex flex-row gap-3 mt-4">

            {/* Approve only when DRAFT */}
            {note.status === "draft" && (
              <button
                onClick={handleApproveFinal}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve Final Note
              </button>
            )}

            {/* Copy is always available */}
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Copy to Clipboard
            </button>

          </div>
        </div>

        {/* TRANSCRIPT */}
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
