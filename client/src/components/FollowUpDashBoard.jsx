import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

const baseUrl = "http://localhost:3000/api";

export default function FollowUpDashboard() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // default = all upcoming
  const [view, setView] = useState("list"); // list | calendar

  async function loadData() {
    setLoading(true);

    const res = await fetch(
      `${baseUrl}/followups?range=${filter}&search=${search}`,
      { credentials: "include" }
    );

    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    const timeout = setTimeout(() => loadData(), 300);
    return () => clearTimeout(timeout);
  }, [filter, search]);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // 🔥 Severity Color Logic
  function getSeverity(item) {
    const status = item.followUp.status;
    const date = new Date(item.followUp.date);
    const today = new Date();

    if (status === "completed")
      return { text: "Completed", color: "bg-green-100 text-green-700" };

    if (date < today)
      return { text: "Overdue", color: "bg-red-100 text-red-700" };

    const diff = (date - today) / (1000 * 60 * 60 * 24);

    if (diff <= 7)
      return { text: "Due Soon", color: "bg-amber-100 text-amber-700" };

    return { text: "Upcoming", color: "bg-blue-100 text-blue-700" };
  }

  // ------------------------------
  // 📅 CALENDAR VIEW
  // ------------------------------
  function CalendarView({ items }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const days = Array.from(
      { length: monthEnd.getDate() },
      (_, i) => i + 1
    );

    return (
      
      <div className="grid grid-cols-7 gap-4 mt-6">
        {days.map((day) => {
          const dateObj = new Date(year, month, day);
          const dateStr = dateObj.toISOString().split("T")[0];

          const matched = items.filter((i) =>
            i.followUp.date.startsWith(dateStr)
          );

          return (
            <div
              key={day}
              className="p-3 border rounded-lg min-h-[100px] bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="font-semibold mb-2">{day}</div>

              {matched.map((m) => {
                const sev = getSeverity(m);
                return (
                  <div
                    key={m._id}
                    className={`text-xs my-1 p-1 rounded cursor-pointer ${sev.color}`}
                    onClick={() =>
                      (window.location.href = `/patient-details?id=${m.patientId}`)
                    }
                  >
                    {m.patientName}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // ------------------------------
  // 📄 LIST VIEW
  // ------------------------------
  function ListView({ items }) {
    return (
      <div className="space-y-5 mt-6">
        {items.map((item) => {
          const sev = getSeverity(item);

          return (
            <div
              key={item._id}
              className="p-5 bg-white border shadow-xl rounded-xl hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-start">

                {/* LEFT SIDE */}
                <div>
                  <h3 className="text-xl font-semibold">{item.patientName}</h3>
                  <p className="text-gray-600 text-sm">PID: {item.patientId}</p>
                  <p className="text-gray-600 text-sm">DOB: {item.dob}</p>

                  <p className="text-blue-600 font-medium mt-3 text-sm">
                    Follow-Up: {formatDate(item.followUp.date)}
                  </p>

                  <p className="text-gray-700 mt-1">
                    {item.followUp.message}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${sev.color}`}
                    >
                      {sev.text}
                    </span>

                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      Last Visit: {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/patient-details?id=${item.patientId}`)
                    }
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={async () => {
                      await fetch(`${baseUrl}/followups/${item._id}/send`, {
                        method: "POST",
                        credentials: "include",
                      });
                      alert("Email sent!");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Send Email
                  </button>

                  {item.followUp.status !== "completed" && (
                    <button
                      onClick={async () => {
                        await fetch(
                          `${baseUrl}/followups/${item._id}/complete`,
                          {
                            method: "PUT",
                            credentials: "include",
                          }
                        );
                        loadData();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ------------------------------
  // MAIN RETURN UI
  // ------------------------------
  return (
   
    <div className="p-8 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold tracking-tight">
        Follow-Up Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Track upcoming and past patient follow-ups.
      </p>

      {/* VIEW TOGGLE */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("list")}
        >
          List View
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            view === "calendar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("calendar")}
        >
          Calendar View
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name, PID, message…"
          className="w-full p-3 border rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          ["", "All Upcoming"],
          ["range7", "Next 7 Days"],
          ["range30", "Next 30 Days"],
          ["6months", "Last 6 Months"],
          ["1year", "Last 1 Year"],
          ["2years", "Last 2 Years"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <p>Loading…</p>}

      {/* CONTENT */}
      {!loading &&
        (view === "list" ? (
          <ListView items={items} />
        ) : (
          <CalendarView items={items} />
        ))}
    </div>
   
  );
}
