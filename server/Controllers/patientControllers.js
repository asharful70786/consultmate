import Patient from "../Model/patient.js";


export const addNewPatient = async (req, res) => {
  try {
    const { name, dob, patientId } = req.body;

    if (!name || !dob || !patientId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await Patient.findOne({ patientId });
    if (exists) {
      return res.status(409).json({ error: "Patient ID already exists" });
    }

    const newPatient = await Patient.create({ name, dob, patientId });

    res.json({
      message: "Patient added successfully",
      patient: newPatient,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
