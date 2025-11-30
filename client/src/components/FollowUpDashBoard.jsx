// will add filter wise dashboard here 

import React, { useEffect, useState } from "react";
const baseUrl = "http://localhost:3000/api";

export default function FollowUpDashboard() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function loadFollowups() {
    setLoading(true);
    const res = await fetch(`${baseUrl}/followups?range=10`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function sendEmail(id) {
    await fetch(`${baseUrl}/followups/${id}/send`, {
      method: "POST",
      credentials: "include",
    });
    alert("Follow-up email sent!");
  }

  async function markDone(id) {
    await fetch(`${baseUrl}/followups/${id}/complete`, {
      method: "PUT",
      credentials: "include",
    });
    loadFollowups();
  }

  useEffect(() => {
    loadFollowups();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Follow-Up Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Patients requiring follow-up within the next 10 days.
      </p>

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <p>No follow-ups due.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.patientName}</h3>
                <p className="text-sm text-gray-600">PID: {item.patientId}</p>
                <p className="text-sm text-blue-600">
                  Follow-up Date: {item.followUp.date}
                </p>
                <p className="text-sm mt-1">{item.followUp.message}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => sendEmail(item._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Send Email
                </button>

                <button
                  onClick={() => markDone(item._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
