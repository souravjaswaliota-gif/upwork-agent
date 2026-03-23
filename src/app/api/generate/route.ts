import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. YOUR SAM PROMPT (Make sure it includes {JOB_DESCRIPTION} inside the text)
    const SYSTEM_PROMPT = `You are Sam's elite Upwork proposal writer... {JOB_DESCRIPTION}`;

    let finalPrompt = "";

    // 2. DETECT WHICH AGENT IS CALLING
    if (data.jobDescription) {
      // It's the Upwork Agent
      finalPrompt = SYSTEM_PROMPT.replace("{JOB_DESCRIPTION}", data.jobDescription);
    } else if (data.prompt) {
      // It's the Scout Agent
      finalPrompt = data.prompt;
    } else {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 3. RUN THE AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    // 4. THE FIX: Return both keys so both pages are happy
    return NextResponse.json({
      proposal: responseText, // Upwork expects this
      text: responseText      // Scout expects this
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}