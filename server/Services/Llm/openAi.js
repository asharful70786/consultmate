import { OpenAI } from "openai";
import fs from "fs";
import basePrompt from "./prompt.js";

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

   
    const finalPrompt = `  ${basePrompt} Transcript:  ${transcript} `;


    const noteRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: finalPrompt
        }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(noteRes.choices[0].message.content);
    const structuredNote = noteRes.choices[0].message.content;

    return { transcript, structuredNote };

  } catch (error) {
    console.error("LLM ERROR:", error);
    throw error;
  }
}
