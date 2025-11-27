import mongoose from "mongoose";

const FinalNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  transcript: String,
  keyPoints: Object,
  structuredNote: String,
  createdAt: { type: Date, default: Date.now }
});

const FinalNote = mongoose.model("FinalNote", FinalNoteSchema);

export default FinalNote;
