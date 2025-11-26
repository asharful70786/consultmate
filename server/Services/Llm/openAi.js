import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processAudio_Capture(audioPath) {
  try {
    const transcriptRes = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "text"
    });

    const transcript = transcriptRes;

    // 2️⃣ Generate Clinical Note
    const prompt = `
      You are a clinical documentation assistant.
      Based on this conversation transcript, extract:
      - Presenting complaint
      - HPI
      - Key symptoms
      - Assessment
      - Plan

      Return a structured note in clean EMIS format.

      Transcript:
      ${transcript}
    `;

    const noteRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const structuredNote = noteRes.choices[0].message.content;
    // console.log(structuredNote)

    return {
      transcript,
      structuredNote
    };

  } catch (error) {
    console.error("LLM ERROR:", error);
    throw error;
  }
}
