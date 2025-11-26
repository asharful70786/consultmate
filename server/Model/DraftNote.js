import mongoose from "mongoose";
const DraftNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  transcript: String,
  keyPoints: Object,
  structuredNote: String,
  status: { type: String, default: "draft" } ,
  createdAt: { type: Date, default: Date.now }
});

DraftNoteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 1 day

const DraftNote = mongoose.model("DraftNote", DraftNoteSchema);

export default DraftNote;
