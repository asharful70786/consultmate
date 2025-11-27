import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AddPatientIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SelectPatientIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ForwardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/add-patient", label: "Add Patient", icon: <AddPatientIcon /> },
    { path: "/select-patient", label: "Select Patient", icon: <SelectPatientIcon /> },
    { path: "/profile", label: "Profile", icon: <ProfileIcon /> }, // 👈 MOVED HERE
  ];

  const isActivePath = (path) => location.pathname === path;

  const sidebarVariants = {
    closed: { x: -100, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate="open"
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 px-8 py-12 flex flex-col"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="text-2xl font-light text-slate-800 tracking-tight">
            Consult<span className="font-semibold text-blue-600">Mate</span>
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 mt-2"></div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => navigate(item.path)}
              className={`
                relative text-left px-6 py-4 rounded-2xl transition-all duration-300
                flex items-center gap-4 group
                ${isActivePath(item.path)
                  ? "bg-white shadow-lg shadow-blue-500/10 text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:bg-white/50 hover:shadow-md hover:text-slate-800"
                }
              `}
            >
              {isActivePath(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className={`
                p-2 rounded-lg transition-colors duration-300
                ${isActivePath(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                }
              `}>
                {item.icon}
              </div>

              <span className="font-medium tracking-wide">{item.label}</span>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="ml-auto text-slate-400"
              >
                →
              </motion.div>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(-1)}
                className="
                  px-4 py-2.5 bg-white text-slate-700 rounded-xl
                  hover:bg-slate-50 border border-slate-200
                  transition-all duration-200 
                  flex items-center gap-2 shadow-sm hover:shadow-md
                "
              >
                <BackIcon />
                <span>Back</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(1)}
                className="
                  px-4 py-2.5 bg-white text-slate-700 rounded-xl
                  hover:bg-slate-50 border border-slate-200
                  transition-all duration-200 
                  flex items-center gap-2 shadow-sm hover:shadow-md
                "
              >
                <span>Forward</span>
                <ForwardIcon />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium text-slate-700"
            >
              {navItems.find(item => item.path === location.pathname)?.label || "ConsultMate"}
            </motion.div>
          </div>
        </motion.div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
