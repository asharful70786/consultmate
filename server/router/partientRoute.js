import express from "express";
import CheckAuth from "../middleware/CheckAuth.js";
import { addNewPatient, getAllPatients } from "../Controllers/patientControllers.js";

const router = express.Router();

router.get("/all-patient", CheckAuth, getAllPatients );

router.post("/add-new-patient", CheckAuth,  addNewPatient);

export default router;

