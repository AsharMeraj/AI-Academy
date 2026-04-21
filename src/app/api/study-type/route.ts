import { db } from "@/configs/db"
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { courseId, studyType } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
        }

        if (studyType === 'ALL') {
            // OPTIMIZATION: Fire both queries at the same time (Parallel Execution)
            const [notes, contentList] = await Promise.all([
                db.select().from(CHAPTER_NOTES_TABLE)
                    .where(and(
                        eq(CHAPTER_NOTES_TABLE.courseId, courseId),
                        eq(CHAPTER_NOTES_TABLE.status, "Ready")
                    )),
                db.select().from(STUDY_TYPE_CONTENT_TABLE)
                    .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
            ]);

            const result = {
                notes: notes,
                flashcard: contentList.filter(item => item.type === 'flashcard'),
                quiz: contentList.filter(item => item.type === 'quiz'),
                qa: contentList.filter(item => item.type === 'qa')
            };

            return NextResponse.json({ result });
        }

        // Optimized single-type fetches
        const targetTable = studyType === 'notes' ? CHAPTER_NOTES_TABLE : STUDY_TYPE_CONTENT_TABLE;
        const query = db.select().from(targetTable as any).where(
            and(
                eq((targetTable as any).courseId, courseId),
                studyType !== 'notes' ? eq((targetTable as any).type, studyType) : undefined
            )
        );

        const data = await query;
        
        // Return single objects for quiz/qa as per your original logic
        const responseData = (studyType === 'quiz' || studyType === 'qa') ? data[0] : data;
        return NextResponse.json({ [studyType]: responseData });

    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}