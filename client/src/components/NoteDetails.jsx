import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function NoteDetails() {
  const [params] = useSearchParams();
  const noteId = params.get("noteId");
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [parsed, setParsed] = useState(null);

  // NEW STATES
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    async function loadNote() {
      const res = await fetch(`${baseUrl}/note-details/${noteId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setNote(data);

      try {
        const json = JSON.parse(data.structuredNote);
        setParsed(json);
        setEditText(json.structuredNote || "");
      } catch (e) {
        console.error("Invalid JSON", e);
        setParsed(null);
      }
    }

    loadNote();
  }, [noteId]);

  if (!note) {
    return (
      <MainLayout>
        <div className="p-6">Loading...</div>
      </MainLayout>
    );
  }

  // Save Edit
  async function saveEdit() {
    const updated = { ...parsed, structuredNote: editText };

    await fetch(`${baseUrl}/note-details/${noteId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredNote: JSON.stringify(updated),
      }),
    });

    setParsed(updated);
    setIsEditing(false);
  }

  // Delete Note
  async function deleteNote() {
    await fetch(`${baseUrl}/note-details/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/"); // redirect anywhere you want
  }

  const renderField = (field) => {
    if (!field) return null;

    if (Array.isArray(field)) {
      return (
        <ul className="list-disc ml-6 space-y-1">
          {field.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return <p className="mt-1">{field}</p>;
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* BUTTONS ADDED HERE */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>

        <h1 className="text-2xl font-bold">Clinical Summary</h1>

        {/* Header Info */}
        <div className="bg-gray-50 border p-4 rounded flex flex-wrap gap-6 text-sm">
          <p><strong>Note ID:</strong> {note._id}</p>
          <p><strong>Patient ID:</strong> {note.patientId}</p>
          <p><strong>Approved At:</strong> {new Date(note.approvedAt).toLocaleString()}</p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {parsed?.presentingComplaint && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold mb-1">Presenting Complaint</h3>
                <p className="text-sm">{parsed.presentingComplaint}</p>
              </div>
            )}

            {parsed?.hpi && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                <h3 className="font-semibold mb-1">History of Present Illness</h3>
                <p className="text-sm">{parsed.hpi}</p>
              </div>
            )}

            {parsed?.assessment && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold mb-1">Assessment</h3>
                <p className="text-sm">{parsed.assessment}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {parsed?.keySymptoms && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                <h3 className="font-semibold mb-1">Key Symptoms</h3>
                <ul className="list-disc ml-6 text-sm">
                  {parsed.keySymptoms.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {parsed?.plan && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <h3 className="font-semibold mb-1">Plan</h3>
                <ul className="list-disc ml-6 text-sm">
                  {parsed.plan.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {parsed?.risks && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <h3 className="font-semibold mb-1">Risks</h3>
                <ul className="list-disc ml-6 text-sm">
                  {parsed.risks.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Pros, Cons, Follow Up, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parsed?.pros && (
            <div className="border p-4 rounded bg-green-50">
              <h3 className="font-semibold mb-1">Pros</h3>
              {renderField(parsed.pros)}
            </div>
          )}

          {parsed?.cons && (
            <div className="border p-4 rounded bg-red-50">
              <h3 className="font-semibold mb-1">Cons</h3>
              {renderField(parsed.cons)}
            </div>
          )}

          {parsed?.followUp && (
            <div className="border p-4 rounded bg-blue-50">
              <h3 className="font-semibold mb-1">Follow-Up</h3>
              {renderField(parsed.followUp)}
            </div>
          )}
        </div>

        {/* Tags */}
        {parsed?.tags && (
          <div className="flex gap-2 flex-wrap">
            {parsed.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Final Summary */}
        {parsed?.structuredNote && (
          <div className="bg-white border p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Final Summary</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {parsed.structuredNote}
            </p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

            <textarea
              className="w-full h-40 border p-2 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            ></textarea>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete this note?</h2>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteNote}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
