import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";

const baseUrl = "http://localhost:3000/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getProfile() {
    try {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-10">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-slate-800 mb-6"
        >
          Profile Overview
        </motion.h1>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-lg p-8"
        >
          {loading ? (
            <div className="py-10 text-center text-slate-500">
              Loading profile...
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {profile?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {profile?.email}
                  </h2>
                  <p className="text-sm text-slate-500">Doctor Account</p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-slate-700 font-medium">{profile?.email}</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <p className="text-slate-700 font-medium">{profile?.role}</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Account Created
                  </p>
                  <p className="text-slate-700 font-medium">
                    {new Date(profile?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    User ID
                  </p>
                  <p className="text-slate-700 font-medium">{profile?._id}</p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => fetch(`${baseUrl}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                  }).then(() => window.location.href = "/login")}
                  className="
                    px-6 py-3 rounded-xl 
                    bg-red-500 hover:bg-red-600 
                    text-white text-sm font-semibold 
                    transition-all shadow-md
                  "
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
