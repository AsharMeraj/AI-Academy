import { generateCourseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy, date } = await req.json();

    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, List of chapters (Max 3) along with summary and Emoji for each chapter, Topic list for each chapter. All result in JSON format.`;

    let aiResult;
    try {
      aiResult = await generateCourseOutline(PROMPT);
    } catch (aiError: any) {
      console.error("AI Generation Error:", aiError);
      return NextResponse.json(
        { error: "AI service is currently overloaded. Please try again in a moment." },
        { status: 503 }
      );
    }

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

    return NextResponse.json({ result: dbResult[0] });

  } catch (error: any) {
    console.error("Critical Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}