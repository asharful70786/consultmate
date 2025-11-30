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
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/add-new-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed");
        return;
      }

      alert("Patient added successfully!");
      window.location.href = "/select-patient";
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Add New Patient
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Gender */}
          <select
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
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
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          {/* Address */}
          <textarea
            placeholder="Full Address"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none min-h-[90px]"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          {/* DOB */}
          <input
            type="date"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            required
          />

          {/* Submit Button */}
          <button
            className={`py-3 rounded-lg text-white font-medium mt-2 transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Save Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}
