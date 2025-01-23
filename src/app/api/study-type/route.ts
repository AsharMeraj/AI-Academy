import { db } from "@/configs/db"
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request){

    const {courseId, studyType} = await req.json()


    if(studyType === 'ALL'){
        const notes = await db.select().from(CHAPTER_NOTES_TABLE).where(and(eq(CHAPTER_NOTES_TABLE.courseId,courseId),eq(CHAPTER_NOTES_TABLE.status,"Ready")))

        // Get the all other study type record

        const contentList = await db.select().from(STUDY_TYPE_CONTENT_TABLE)
        .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))

        console.log(contentList)
        const result = {
            notes: notes,
            flashcard: contentList.filter(item=> item.type === 'flashcard'),
            quiz: contentList.filter(item=> item.type === 'quiz'),
            qa: contentList.filter(item=> item.type === 'qa')
        }
        return NextResponse.json({result})
    }
    else if(studyType === 'notes'){
        const notes = await db.select().from(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId,courseId))

        return NextResponse.json({Notes: notes})
    }
    else if(studyType === 'flashcard'){
        const flashcard = await db.select().from(STUDY_TYPE_CONTENT_TABLE).where(and(eq(STUDY_TYPE_CONTENT_TABLE.courseId,courseId),eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)))

        return NextResponse.json({flashcard})
    }
    else if(studyType === 'quiz'){
        const quiz = await db.select().from(STUDY_TYPE_CONTENT_TABLE).where(and(eq(STUDY_TYPE_CONTENT_TABLE.courseId,courseId),eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)))

        return NextResponse.json({quiz: quiz[0]})
    }
    else {
        const qa = await db.select().from(STUDY_TYPE_CONTENT_TABLE).where(and(eq(STUDY_TYPE_CONTENT_TABLE.courseId,courseId),eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)))

        return NextResponse.json({qa: qa[0]})
    }
}