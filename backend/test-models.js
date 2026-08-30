import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function list() {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.0-pro'];
  for (const m of models) {
    try {
      const response = await ai.models.generateContent({
        model: m,
        contents: "hello",
      });
      console.log(`Success with ${m}:`, response.text);
    } catch (e) {
      console.error(`Error with ${m}:`, e.message);
    }
  }
}

list();
