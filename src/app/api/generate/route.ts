import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using 1.5-flash because it is the most reliable version right now
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = data.jobDescription
      ? `Write a professional Upwork proposal for: ${data.jobDescription}`
      : data.prompt;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      proposal: text,
      text: text
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message || "AI Connection Failed" }, { status: 500 });
  }
}