import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 2. Setup the prompt
    const SAM_PROMPT = `You are Sam, an elite digital marketing consultant. {JOB_DESCRIPTION}`;
    let finalPrompt = data.jobDescription
      ? SAM_PROMPT.replace("{JOB_DESCRIPTION}", data.jobDescription)
      : data.prompt;

    if (!finalPrompt) return NextResponse.json({ error: "No input" }, { status: 400 });

    // 3. Use the STABLE model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      proposal: text,
      text: text
    });
  } catch (error: any) {
    console.error("DEBUG:", error);
    return NextResponse.json({ error: "AI Connection Failed" }, { status: 500 });
  }
}