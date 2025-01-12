import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    const { createdBy } = await req.json()

    const result = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy)).orderBy(desc(STUDY_MATERIAL_TABLE.id))
    return NextResponse.json({ result })
}

export async function GET(req: Request) {
    const reqUrl = req.url
    const { searchParams } = new URL(reqUrl)
    const courseId = searchParams.get('courseId')?.trim()

    if (courseId) {
        const course = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))

        return NextResponse.json({ result: course[0] })
    }

}