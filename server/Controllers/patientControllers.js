import Patient from "../Model/patient.js";


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