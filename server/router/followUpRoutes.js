import express from "express";
import FinalNote from "../Model/FinalNote.js";


const router = express.Router();

// GET follow-ups within X days or overdue
router.get("/", async (req, res) => {
  try {
    const { range, overdue } = req.query;

    const now = new Date();

    let query = {
      "followUp.status": "pending",
      "followUp.date": { $exists: true, $ne: "" },
    };

    if (range) {
      // followUp.date is stored as string "2025-02-01"
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(range));

      query["followUp.date"] = {
        $lte: targetDate.toISOString().split("T")[0],
        $gte: now.toISOString().split("T")[0],
      };
    }

    if (overdue === "true") {
      query["followUp.date"] = {
        $lt: now.toISOString().split("T")[0],
      };
    }

    const items = await FinalNote.find(query).populate("patientId");

    const result = items.map((item) => ({
      _id: item._id,
      patientId: item.patientId?._id,
      patientName: item.patientId?.name,
      followUp: item.followUp,
      createdAt: item.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load follow-ups" });
  }
});


router.post("/:id/send", async (req, res) => {
  try {
    const note = await FinalNote.findById(req.params.id).populate("patientId");
    if (!note) return res.status(404).json({ error: "Note not found" });

    const email = note.patientId.email;
    const name = note.patientId.name;

    await sendFollowUpEmail({
      email,
      name,
      message: note.followUp.message,
      date: note.followUp.date,
    });

    res.json({ message: "Follow-up email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});


router.put("/:id/complete", async (req, res) => {
  try {
    const note = await FinalNote.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.followUp.status = "completed";
    await note.save();

    res.json({ message: "Marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});






export default router;