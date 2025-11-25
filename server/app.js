import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

// connect DB
import connectDb from "./Config/db.js";
connectDb();

import authRouter from "./router/authRoute.js";
import patientRouter from "./router/partientRoute.js";

const app = express();
app.use(express.json());
app.use(cookieParser("secret"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// ===== MULTER SETUP =====
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1000 * 500 } // 500MB
});


function clearOldAudio(currentFile) {
  const uploadDir = "./uploads";

  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error("Error reading upload folder:", err);

    files.forEach(file => {
      if (file !== currentFile) {
        fs.unlink(path.join(uploadDir, file), (err) => {
          if (!err) console.log("Deleted old file:", file);
        });
      }
    });
  });
}


// ========================

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// auth
app.use('/api/auth', authRouter);
app.use('/api', patientRouter);

// UPLOAD ROUTE
app.post('/api/upload', upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file received" });
  }

  console.log("File saved:", req.file.filename);
    clearOldAudio(req.file.filename);

  res.json({
    message: 'File uploaded successfully',
    file: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message);
  res.status(statusCode).send(err.message);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
