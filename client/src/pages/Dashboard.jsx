import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:3000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    totalNotes: 0,
    todayNotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/dashboard-stats`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      subtitle: "Active in care",
      icon: "👥",
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "New Patients",
      value: stats.newPatients,
      subtitle: "This month",
      icon: "🆕",
      color: "green",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Total Notes",
      value: stats.totalNotes,
      subtitle: "All time records",
      icon: "📝",
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Notes Today",
      value: stats.todayNotes,
      subtitle: "Created today",
      icon: "📅",
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const quickActions = [
    {
      title: "Add New Patient",
      description: "Register a new patient and store demographic details",
      icon: "➕",
      path: "/add-patient",
      color: "blue",
      buttonText: "Register Patient"
    },
    {
      title: "Patient Records",
      description: "View patient details and start a recording session",
      icon: "📁",
      path: "/select-patient",
      color: "green",
      buttonText: "View Records"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Patient Management Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back, Doctor. Here's your practice overview.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                <span className="text-white text-xl">{card.icon}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </h2>
            <p className="text-gray-500 text-sm">{card.subtitle}</p>
            
            {/* Animated underline */}
            <div className={`w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${card.gradient} transition-all duration-300 mt-3`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <div 
            key={index}
            onClick={() => navigate(action.path)}
            className="cursor-pointer bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:border-blue-200"
          >
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 bg-${action.color}-100 text-${action.color}-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {action.description}
                </p>
                
                <button className={`px-6 py-3 bg-${action.color}-500 text-white rounded-xl font-medium hover:bg-${action.color}-600 transition-colors duration-200 shadow-sm hover:shadow-md`}>
                  {action.buttonText}
                </button>
              </div>
            </div>
            
            {/* Hover indicator */}
            <div className="flex items-center justify-end mt-4">
              <span className="text-gray-400 text-sm group-hover:text-blue-500 transition-colors flex items-center gap-2">
                Click to access
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium truncate">New patient registration completed</p>
                <p className="text-gray-500 text-sm">Patient ID: PT-00{item} • 2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}