import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy, date } = await req.json();

    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, List of chapters (Max 3) along with summary and Emoji for each chapter, Topic list for each chapter. All result in JSON format. Do not include markdown code blocks.`;

    let aiResult;
    try {
      // Logic: AI models are volatile. Don't let a 503 kill your entire process.
      const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
      let rawText = aiResp.response.text();

      // CLEANING: Remove potential Markdown formatting (```json ... ```) 
      // which Gemini frequently adds and causes JSON.parse to fail.
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      aiResult = JSON.parse(cleanJson);
      
    } catch (aiError: any) {
      console.error("AI Generation Error:", aiError);
      return NextResponse.json(
        { error: "AI service is currently overloaded. Please try again in a moment." },
        { status: 503 }
      );
    }

    // Save data to the database
    // Note: If this fails, you have a DB connection issue in Karachi/Region.
    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
      courseId,
      courseType,
      createdBy,
      topic,
      courseLayout: aiResult,
      difficultyLevel,
      date
    }).returning();

    if (!dbResult || dbResult.length === 0) {
        throw new Error("Database insertion failed.");
    }

    // Trigger Inngest event
    // This is good—you're offloading the heavy "Note Generation" to a background job.
    await inngest.send({
      name: "notes.generate",
      data: { course: dbResult[0] },
    });

    return NextResponse.json({ result: dbResult[0] });

  } catch (error: any) {
    console.error("Critical Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}