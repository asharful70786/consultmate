import Patient from "../Model/patient.js";
import {processAudio_Capture} from "../Services/Llm/openAi.js";
import clearOldAudio from "../utils/Cleaner.js";
import extractKeyPoints from "../utils/extractKeyPoints.js";
import DraftNote from "../Model/DraftNote.js";
import FinalNote from "../Model/FinalNote.js";

export const review_Draft_Note = async (req, res) => {
  console.log(req.params.noteId)

  try {
    const draft = await DraftNote.findById(req.params.noteId);
    if (!draft)       return res.status(404).json({ error: "Draft note not found" });
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const final_submit = async (req, res) => {
  try {
    const { patientId, structuredNote } = req.body;
    const { noteId } = req.params;

    if (!patientId || !structuredNote) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const draft = await DraftNote.findById(noteId);

    if (!draft) {
      return res.status(404).json({ error: "Draft note not found" });
    }

    // 2️⃣ Prevent DOUBLE APPROVAL
    if (draft.status === "approved") {
      return res.status(400).json({
        error: "This draft note has already been approved",
      });
    }

    // 3️⃣ Check if final note already exists
    const existingFinal = await FinalNote.findOne({ patientId, derivedFrom: noteId });

    if (existingFinal) {
      return res.status(400).json({
        error: "A final note for this draft already exists",
        finalNoteId: existingFinal._id
      });
    }

    // 4️⃣ Create final note
    const finalNote = await FinalNote.create({
      patientId,
      structuredNote,
      derivedFrom: noteId,      // VERY IMPORTANT
      approvedBy: req.user?._id || null,
    });

    // 5️⃣ Link to patient
    await Patient.findByIdAndUpdate(patientId, {
      $addToSet: { notes: finalNote._id },   // avoids duplicates
    });

    // 6️⃣ Mark draft as approved
    draft.status = "approved";
    await draft.save();

    res.status(200).json({
      message: "Note finalized successfully",
      finalNoteId: finalNote._id,
      patientId,
    });

  } catch (err) {
    console.error("Finalize Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


export const NoteDetails = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await FinalNote.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};