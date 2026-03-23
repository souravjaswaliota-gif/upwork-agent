import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. SAM'S PROPOSAL PROMPT
    const SYSTEM_PROMPT = `You are Sam's elite Upwork proposal writer... [Paste your full Sam prompt here]`;

    let finalPrompt = "";

    // 2. CHECK: Is this Upwork or Scout?
    if (data.jobDescription) {
      // It's the Upwork Agent calling
      finalPrompt = SYSTEM_PROMPT.replace("{JOB_DESCRIPTION}", data.jobDescription);
    } else if (data.prompt) {
      // It's the Scout Agent calling
      finalPrompt = data.prompt;
    } else {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    // 3. GENERATE
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    // 4. THE MAGIC: Return BOTH keys so both pages work!
    return NextResponse.json({
      proposal: responseText, // Upwork page looks for this
      text: responseText      // Scout page looks for this
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}