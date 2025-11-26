import express from "express";
import { login, logout, register, stacks, userDetails } from "../Controllers/authControllers.js";
import CheckAuth from "../middleware/CheckAuth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",logout );
router.get("/me", CheckAuth , userDetails);

router.get("/dashboard-stats", CheckAuth , stacks );


export default router