import Patient from "../Model/patient.js";
import {processAudio_Capture} from "../Services/Llm/openAi.js";
import clearOldAudio from "../utils/Cleaner.js";
import extractKeyPoints from "../utils/extractKeyPoints.js";
import DraftNote from "../Model/DraftNote.js";
import FinalNote from "../Model/FinalNote.js";
import sendMail from "../Services/mail/SendMail.js";

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
    let { structuredNote  , patientId } = req.body;
    const { noteId } = req.params;

    if (!patientId || !structuredNote)       return res.status(400).json({ error: "Missing required fields" });
    
    try {
      structuredNote = JSON.parse(structuredNote);  
    } catch (err) {
      console.log("❌ Error parsing structuredNote JSON:", err);
      return res.status(400).json({ error: "Invalid structuredNote JSON" });
    }

    let followUp = undefined;
    if (
      structuredNote.followUp &&
      structuredNote.followUp.date
    ) {
      followUp = {
        date: structuredNote.followUp.date,
        message: structuredNote.followUp.message || "",
        status: structuredNote.followUp.status || "pending",
      };
    }
    const draft = await DraftNote.findById(noteId);
    if (!draft) {
      return res.status(404).json({ error: "Draft note not found" });
    }

    if (draft.status === "approved")  return res.status(400).json({ error: "This draft note has already been approved" });
    
   const existingFinal = await FinalNote.findOne({
      patientId,
      derivedFrom: noteId,
    });

    if (existingFinal) return res.status(400).json({error: "A final note for this draft already exists",finalNoteId: existingFinal._id});
  
    const finalNote = await FinalNote.create({
      patientId,
      structuredNote: JSON.stringify(structuredNote),
      derivedFrom: noteId,
      approvedBy: req.user?._id || null,
      ...(followUp && { followUp }),
    });

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { notes: finalNote._id } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    draft.status = "approved";
    await draft.save();

   await sendMail({ email: patient.email,  finalText:structuredNote.structuredNote,  subject: "Your Final Clinical Note",  });

   return res.status(200).json({ message: "Final note created successfully", finalNoteId: finalNote._id,followUp,});

  } catch (err) {
    console.error("❌ Finalize Error:", err);
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

export const edit_Final_Note =  async (req, res) => {
  try {
    const { structuredNote } = req.body;

    const updated = await FinalNote.findByIdAndUpdate(
      req.params.id,
      { structuredNote },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("UPDATE NOTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteNote = async (req, res) => {
  try {
    const deleted = await FinalNote.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });

  } catch (err) {
    console.error("DELETE NOTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}