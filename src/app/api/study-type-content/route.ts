import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { chapters, courseId, type } = await req.json()
    const PROMPT =
    type === 'flashcard' ?
    `Generate the flashcards on topic : ${chapters} in JSON format with front back content Maximum 15`
    : type === 'quiz'?
    `Generate Quiz on topic: ${chapters} with Question and one word options along with correct answer in JSON format, (Max 10)`
    : `Generate Question answers on topic: ${chapters}. The result should have an array of object with "question" and "answer" field as key value pair in each object. All the result in JSON format, (Max 10)`

    const result = await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseId,
        type,
    }).returning({ id: STUDY_TYPE_CONTENT_TABLE.id })


    inngest.send({
        name: 'studyType.content',
        data: {
            studyType: type,
            prompt: PROMPT,
            courseId: courseId,
            recordId: result[0].id
        }
    })

    return NextResponse.json({ id: result[0].id })


}