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

    // Link to the draft it came from
    derivedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DraftNote",
      default: null,
    },

    followUp: {
      date: { type: String },
      message: { type: String },
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FinalNote", FinalNoteSchema);
