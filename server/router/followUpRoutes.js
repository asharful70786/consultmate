import express from "express";
import FinalNote from "../Model/FinalNote.js";
import sendFollowUpEmail from "../Services/mail/sendFollowUpEmail.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { range, search } = req.query;

    const today = new Date();
    let items = await FinalNote.find().populate("patientId");

    // -------------------------------------
    // Convert to Date objects
    // -------------------------------------
    items = items
      .filter((item) => item.followUp?.date)
      .map((item) => ({
        ...item._doc,
        followUpDate: new Date(item.followUp.date),
      }));

    // -------------------------------------
    // DEFAULT: Only upcoming (future) + pending
    // -------------------------------------
    items = items.filter(
      (i) =>
        i.followUp.status === "pending" &&
        i.followUpDate >= today
    );

    // -------------------------------------
    // FILTER: Next 7 or 30 days
    // -------------------------------------
    if (range?.startsWith("range")) {
      const days = Number(range.replace("range", ""));
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + days);

      items = items.filter(
        (i) => i.followUpDate >= today && i.followUpDate <= maxDate
      );
    }

    // -------------------------------------
    // HISTORY FILTER (6 months, 1 year, 2 years)
    // -------------------------------------
    const ranges = {
      "6months": 180,
      "1year": 365,
      "2years": 730,
    };

    if (ranges[range]) {
      const past = new Date();
      past.setDate(today.getDate() - ranges[range]);

      items = items.filter(
        (i) => i.followUpDate >= past && i.followUpDate <= today
      );
    }

    // -------------------------------------
    // SEARCH
    // -------------------------------------
    if (search) {
      const term = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.patientId?.name?.toLowerCase().includes(term) ||
          item.patientId?._id?.toString().includes(term) ||
          item.followUp?.message?.toLowerCase().includes(term)
      );
    }

    // -------------------------------------
    // FINAL RESPONSE
    // -------------------------------------
    const result = items.map((item) => ({
      _id: item._id,
      patientId: item.patientId?._id,
      patientName: item.patientId?.name,
      dob: item.patientId?.dob,
      gender: item.patientId?.gender,
      phone: item.patientId?.phone,
      email: item.patientId?.email,
      followUp: item.followUp,
      createdAt: item.createdAt,
    }));

    res.json(result);

  } catch (err) {
    console.error("FOLLOW-UP ERROR:", err);
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



router.post("/send-bulk", async (req, res) => {
  try {
    const { items } = req.body; 

     console.log(items)

    for (const id of items) {
      await sendEmailReminder(id);
    }

    res.json({ message: "All reminders sent." });
  } catch (err) {
    res.status(500).json({ error: "Bulk reminder failed" });
  }
});







export default router;