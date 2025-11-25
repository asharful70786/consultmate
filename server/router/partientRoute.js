import express from "express";
import CheckAuth from "../middleware/CheckAuth.js";
import { addNewPatient, getAllPatients, individual_Patient } from "../Controllers/patientControllers.js";
import Patient from "../Model/patient.js";

const router = express.Router();

router.get("/all-patient", CheckAuth, getAllPatients );

router.post("/add-new-patient", CheckAuth,  addNewPatient);




router.get("/patient/:id",CheckAuth ,  individual_Patient);

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: monthStart },
    });

    // const totalNotes = await Note.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const todayNotes = await Note.countDocuments({
    //   createdAt: { $gte: today },
    // });

    res.json({
      totalPatients,
      newPatients,
      // totalNotes,
      // todayNotes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});




export default router;

