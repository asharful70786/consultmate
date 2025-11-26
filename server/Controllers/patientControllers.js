import Patient from "../Model/patient.js";
import clearOldAudio from "../utils/Cleaner.js";


// ===== MULTER SETUP =====




export const addNewPatient =  async (req, res) => {
  try {
    // Get count to generate new patientId
    const count = await Patient.countDocuments();
    const newId = "P" + String(count + 1).padStart(3, "0"); // P001, P002...

    const patient = new Patient({
      ...req.body,
      patientId: newId,
    });

    await patient.save();

    res.json({ success: true, patientId: newId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const individual_Patient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const upload_Audio =  async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file received" });
  }
   console.log("patient_Mongoose_Id:", req.body.patient_Mongoose_Id);

  clearOldAudio(req.file.filename);

  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    patient: req.body
  });
}


