import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecordingComponent({ patient }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const baseUrl = "http://localhost:3000/api";

  const startRecording = async () => {
    const ok = window.confirm("Start recording consultation?");
    if (!ok) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = async () => {
      clearInterval(intervalRef.current);
      setTimer(0);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      await uploadAudio(blob);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();

    setRecording(true);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    const ok = window.confirm("Stop recording?");
    if (!ok) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    setLoading(true);
  };

   const uploadAudio = async (blob) => {
  const formData = new FormData();
  formData.append("audio", blob);

  formData.append("patientId", patient.patientId);
  formData.append("patient_Mongoose_Id", patient._id);
  formData.append("patientName", patient.name);
  formData.append("patientEmail", patient.email || "");
  formData.append("dob", patient.dob);

  try {
    const res = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    console.log("UPLOAD RESPONSE:", data);

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    // 👇 NAVIGATE HERE (inside try, after successful upload)
    navigate(`/review-note?file=${data.file}&pid=${patient._id}`);

  } catch (err) {
    console.error(err);
    alert("Failed to upload audio.");
  } finally {
    setLoading(false);
  }
};


  // === UI ===
  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-3">Processing audio…</p>
        </div>
      ) : !recording ? (
        <button
          onClick={startRecording}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow transition"
        >
          Start Recording
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute w-40 h-40 bg-red-200 rounded-full animate-ping opacity-50"></div>
            <div className="absolute w-32 h-32 bg-red-300 rounded-full animate-pulse opacity-70"></div>

            <button
              onClick={stopRecording}
              className="relative w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl"
            >
              ⏹
            </button>
          </div>

          <div className="text-xl font-semibold">
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </div>

          <p className="text-gray-500 text-sm">Recording in progress…</p>
        </div>
      )}
    </div>
  );
}
