import express from "express";
import CheckAuth from "../middleware/CheckAuth.js";
import { addNewPatient, getAllPatients, individual_Patient, review_Draft_Note, upload_Audio } from "../Controllers/patientControllers.js";
import Patient from "../Model/patient.js";
import multer from "multer";
import DraftNote from "../Model/DraftNote.js";





const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1000 * 500 } // 500MB
});



const router = express.Router();

router.get("/all-patient", CheckAuth, getAllPatients );

router.post("/add-new-patient", CheckAuth,  addNewPatient);




router.get("/patient/:id",CheckAuth ,  individual_Patient);



router.post("/upload", CheckAuth , upload.single("audio"),  upload_Audio);

router.get("/review/:noteId", CheckAuth, review_Draft_Note);



export default router;

