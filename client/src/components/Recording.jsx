import React from "react";
import { useState, useRef } from "react";

export default function RecordingComponent() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      await uploadAudio(audioBlob);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    setLoading(true);
  };

  const uploadAudio = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob);

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      {loading ? (
        <div className="text-xl animate-pulse">Processing audio…</div>
      ) : recording ? (
        <button className="bg-red-500 text-white px-6 py-3" onClick={stopRecording}>
          Stop Recording
        </button>
      ) : (
        <button className="bg-green-600 text-white px-6 py-3" onClick={startRecording}>
          Start Recording
        </button>
      )}
    </div>
  );
}
