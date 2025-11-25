import React  from "react";
import "./App.css"; 

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPatient from "./pages/patient/AddPatient";
import SelectPatient from "./pages/patient/SelectPatient";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
          <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/select-patient" element={<SelectPatient />} />


      </Routes>

     
       
    </BrowserRouter>
  );
}
