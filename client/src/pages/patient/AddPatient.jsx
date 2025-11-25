import React from "react";
import { useState } from "react";

const baseUrl = "http://localhost:3000/api";

export default function AddPatient() {
  const [form, setForm] = useState({ name: "", dob: "", patientId: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/add-new-patient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // IMPORTANT for session cookies
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert("Patient added!");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-medium mb-6">Add New Patient</h2>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          className="border p-3 rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="date"
          className="border p-3 rounded-lg"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        <input
          type="text"
          placeholder="Patient ID"
          className="border p-3 rounded-lg"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg">
          Save Patient
        </button>
      </form>
    </div>
  );
}