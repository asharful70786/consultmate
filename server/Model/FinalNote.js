import mongoose from "mongoose";

const FinalNoteSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    structuredNote: {
      type: String,
      required: true,
    },

    approvedAt: {
      type: Date,
      default: Date.now,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // optional
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FinalNote", FinalNoteSchema);
