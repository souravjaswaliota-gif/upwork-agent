import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Get the API Key from your Vercel settings
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in Vercel settings" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const data = await req.json();

    // 2. Sam's Professional Identity (Prompt)
    const SAM_IDENTITY = "You are Sam, an elite digital marketing consultant with 15 years of experience. Write a high-converting Upwork proposal for this job: ";

    const prompt = data.jobDescription
      ? SAM_IDENTITY + data.jobDescription
      : data.prompt;

    if (!prompt) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 3. Use the MOST STABLE model name (Fixed the 404 error here)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send back both keys so BOTH agents work perfectly
    return NextResponse.json({
      proposal: text,
      text: text
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message || "AI Connection Failed" }, { status: 500 });
  }
}