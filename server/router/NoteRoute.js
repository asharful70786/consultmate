import express from "express";
import { final_submit, NoteDetails, review_Draft_Note } from "../Controllers/noteControllers.js";
import CheckAuth from "../middleware/CheckAuth.js";


const router = express.Router();

router.get("/review/:noteId", CheckAuth, review_Draft_Note);
router.post("/finalize/:noteId", CheckAuth, final_submit);
router.get("/note-details/:noteId", CheckAuth, NoteDetails);





export default router