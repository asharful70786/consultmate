import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";


dotenv.config();

// connect DB
import connectDb from "./Config/db.js";
connectDb();

import authRouter from "./router/authRoute.js";
import patientRouter from "./router/patientRoute.js";
import NoteRouter from "./router/NoteRoute.js";

const app = express();
app.use(express.json());
app.use(cookieParser("secret"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);









app.get('/', (req, res) => {
  res.send('Hello World!');
});

// auth
app.use('/api/auth', authRouter);
app.use('/api', patientRouter);
app.use('/api', NoteRouter);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message);
  res.status(statusCode).send(err.message);
});






app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
