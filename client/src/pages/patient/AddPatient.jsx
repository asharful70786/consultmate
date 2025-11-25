import React, { useState } from "react";

const baseUrl = "http://localhost:3000/api";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/add-new-patient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert("Patient added successfully!");
    window.location.href = "/select-patient";
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-medium mb-6">Add New Patient</h2>

      <form className="grid grid-cols-1 gap-4 max-w-lg" onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Gender */}
        <select
          className="border p-3 rounded-lg"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Age */}
        <input
          type="number"
          placeholder="Age"
          className="border p-3 rounded-lg"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone Number"
          className="border p-3 rounded-lg"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        {/* Address */}
        <textarea
          placeholder="Address"
          className="border p-3 rounded-lg"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />

        {/* DOB */}
        <input
          type="date"
          className="border p-3 rounded-lg"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          required
        />

          <button
          className="bg-blue-600 text-white py-3 rounded-lg"
          type="submit"
        >
          Save Patient
        </button>
      </form>
    </div>
  );
}
