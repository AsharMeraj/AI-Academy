import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const { courseId, topic, courseType, difficultyLevel, createdBy, date } = await req.json();
  
    // Generate course layout using AI
    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, List of chapters (Max 3) along with summary summary and Emoji for each chapter, Topic list for each chapter. All result in JSON format`;

    // Generate a study material for Python for Exam and level of difficulty will be beginner with summary of course, List of chapters (Max 3) along with summary and Emoji icon for each chapter, Topic list for each chapter. All result in JSON format
  
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    const aiResult = JSON.parse(aiResp.response.text());
  

  
    // Save data to the database
    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
      courseId,
      courseType,
      createdBy,
      topic,
      courseLayout: aiResult,
      difficultyLevel,
      date
    }).returning({
      id: STUDY_MATERIAL_TABLE.id,
      courseId: STUDY_MATERIAL_TABLE.courseId,
      courseType: STUDY_MATERIAL_TABLE.courseType,
      topic: STUDY_MATERIAL_TABLE.topic,
      createdBy: STUDY_MATERIAL_TABLE.createdBy,
      courseLayout: STUDY_MATERIAL_TABLE.courseLayout,
      difficultyLevel: STUDY_MATERIAL_TABLE.difficultyLevel,
    });
  
  
    // Trigger Inngest event

    await inngest.send({
      name: "notes.generate",
      data: {course: dbResult[0]},
    });
  
  
    return NextResponse.json({ result: dbResult[0] });
  }
  