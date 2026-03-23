import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize with a stable model version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. YOUR SAM PROPOSAL PROMPT
        const SYSTEM_PROMPT = `You are Sam's elite Upwork proposal writer. Sam is a 15+ year digital marketing expert. {JOB_DESCRIPTION}`;

        let finalPrompt = "";

        // 2. CHECK: Is this Upwork (jobDescription) or Scout (prompt)?
        if (data.jobDescription) {
            finalPrompt = SYSTEM_PROMPT.replace("{JOB_DESCRIPTION}", data.jobDescription);
        } else if (data.prompt) {
            finalPrompt = data.prompt;
        } else {
            return NextResponse.json({ error: "No input provided" }, { status: 400 });
        }

        // 3. RUN AI (Using gemini-1.5-flash for stability)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        // 4. RETURN BOTH KEYS so both pages work perfectly
        return NextResponse.json({
            proposal: responseText, // For Upwork page
            text: responseText      // For Scout page
        });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "AI Connection Failed" }, { status: 500 });
    }
}