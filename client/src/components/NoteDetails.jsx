import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function NoteDetails() {
  const [params] = useSearchParams();
  const noteId = params.get("noteId");

  const [note, setNote] = useState(null);
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    async function loadNote() {
      const res = await fetch(`${baseUrl}/note-details/${noteId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setNote(data);

      // Parse structuredNote safely
      try {
        const json = JSON.parse(data.structuredNote);
        setParsed(json);
      } catch (e) {
        console.error("Invalid JSON structure:", e);
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

  // Helper renderer for arrays or strings
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

        {/* Presenting Complaint */}
        {parsed?.presentingComplaint && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h3 className="font-semibold mb-1">Presenting Complaint</h3>
            <p className="text-sm">{parsed.presentingComplaint}</p>
          </div>
        )}

        {/* HPI */}
        {parsed?.hpi && (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
            <h3 className="font-semibold mb-1">History of Present Illness</h3>
            <p className="text-sm">{parsed.hpi}</p>
          </div>
        )}

        {/* Assessment */}
        {parsed?.assessment && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h3 className="font-semibold mb-1">Assessment</h3>
            <p className="text-sm">{parsed.assessment}</p>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">

        {/* Key Symptoms */}
        {parsed?.keySymptoms && (
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
            <h3 className="font-semibold mb-1">Key Symptoms</h3>
            <ul className="list-disc ml-6 text-sm">
              {parsed.keySymptoms.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Plan */}
        {parsed?.plan && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h3 className="font-semibold mb-1">Plan</h3>
            <ul className="list-disc ml-6 text-sm">
              {parsed.plan.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Risks */}
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
          <ul className="text-sm list-disc ml-5">{parsed.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      )}

      {parsed?.cons && (
        <div className="border p-4 rounded bg-red-50">
          <h3 className="font-semibold mb-1">Cons</h3>
          <ul className="text-sm list-disc ml-5">{parsed.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      )}

      {parsed?.followUp && (
        <div className="border p-4 rounded bg-blue-50">
          <h3 className="font-semibold mb-1">Follow-Up</h3>
          <ul className="text-sm list-disc ml-5">{parsed.followUp.map((f, i) => <li key={i}>{f}</li>)}</ul>
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
</MainLayout>

  );
}
