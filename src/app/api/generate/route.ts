import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Setup the AI with a STABLE model (gemini-1.5-flash)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 2. Sam's Professional Upwork Prompt
    const SYSTEM_PROMPT = `You are Sam's elite Upwork proposal writer. Sam is a 15+ year digital marketing expert. {JOB_DESCRIPTION}`;

    let finalPrompt = "";

    // 3. Detect if it's the Upwork Agent or the Scout Agent
    if (data.jobDescription) {
      // It's the Upwork Page
      finalPrompt = SYSTEM_PROMPT.replace("{JOB_DESCRIPTION}", data.jobDescription);
    } else if (data.prompt) {
      // It's the Scout Page
      finalPrompt = data.prompt;
    } else {
      return NextResponse.json({ error: "No data received" }, { status: 400 });
    }

    // 4. Run the AI (Using 1.5-flash for maximum stability)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();

    // 5. Return both keys so no frontend page crashes
    return NextResponse.json({
      proposal: text, // For Upwork
      text: text      // For Scout
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "AI Connection Failed" }, { status: 500 });
  }
}