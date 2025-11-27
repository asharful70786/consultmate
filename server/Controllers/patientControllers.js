import Patient from "../Model/patient.js";
import {processAudio_Capture} from "../Services/Llm/openAi.js";
import clearOldAudio from "../utils/Cleaner.js";
import extractKeyPoints from "../utils/extractKeyPoints.js";
import DraftNote from "../Model/DraftNote.js";

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


export const upload_Audio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file received" });
    }

    const audioPath = `uploads/${req.file.filename}`;

    console.log("Audio saved:", audioPath);
    console.log("Patient:", req.body);

    // 1️⃣ Process audio with LLM
    const llmResult = await processAudio_Capture(audioPath);

     const { transcript, structuredNote } = llmResult;
     console.log( `transcript ${transcript}`);
     console.log(`structuredNote ${structuredNote}`);
     return;

// Optional: extract simple key points for UI
const keyPoints = extractKeyPoints(structuredNote);

const draft = await DraftNote.create({
  patientId: req.body.patient_Mongoose_Id,
  transcript,
  keyPoints,
  structuredNote,
  status: "draft",
  createdAt: new Date()
});

 res.status(200).json({
      message: "Processing complete",
      patientId: req.body.patient_Mongoose_Id,
      noteId : draft._id
    });
    
  return  clearOldAudio(req.file.filename);

  } catch (err) {
    console.error(err);
     res.status(500).json({ error: "Processing failed" });
  }
  
};


export const review_Draft_Note = async (req, res) => {
  console.log(req.params.noteId)

  try {
    const draft = await DraftNote.findById(req.params.noteId);
    if (!draft) {
      return res.status(404).json({ error: "Draft note not found" });
    }
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

