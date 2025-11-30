import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPatient from "./pages/patient/AddPatient";
import SelectPatient from "./pages/patient/SelectPatient";
import Indi_PatientDetails from "./pages/patient/Indi_PatientDetails";
import ReviewNote from "./components/ReviewNote";
import NoteDetails from "./components/NoteDetails";
import Profile from "./components/Profile";
import FollowUpDashboard from "./components/FollowUpDashBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED + SIDEBAR WRAPPER */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddPatient />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/select-patient"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SelectPatient />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route  path="/patient-details"  element={
            <ProtectedRoute>
              <MainLayout>
                <Indi_PatientDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />


      <Route path="/review-note" element={<ReviewNote />}/>
      <Route  path="/note-details" element={<ProtectedRoute> <NoteDetails /></ProtectedRoute>  } />
      <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>} />
      <Route path="/follow-up" element={<ProtectedRoute> 
      <MainLayout>
        <FollowUpDashboard />
      </MainLayout>
      </ProtectedRoute>} />



      </Routes>
    </BrowserRouter>
  );
}
