'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { result } from '@/app/_types/Types'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { db } from '@/configs/db'
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { ResultDataContext } from '@/app/_context/CourseCountContext'

const CourseCardItem = ({ course, onDelete }: { course: result, onDelete: (id: string) => void }) => {
  const { Result } = useContext(ResultDataContext)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    UpdateProgress()
  }, [Result, course.courseId])

  const UpdateProgress = async () => {
    const result = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId))

    result[0]?.progress && setProgress(result[0].progress)


  }
  const DeleteRecord = async () => {
    await db.delete(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId))
    await db.delete(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, course.courseId))
    await db.delete(STUDY_TYPE_CONTENT_TABLE).where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, course.courseId))
    onDelete(course.courseId)
  }
  return (
    <div className='border rounded-lg shadow-md p-5'>
      <div>
        <div className='flex items-center justify-between'>
          <Image src={'/knowledge.png'} alt='other' width={50} height={50} />
          <h2 className='text-[10px] p-1 px-2 rounded-full bg-primary text-white'>20 Dec 2024</h2>
        </div>

        <h2 className='mt-3 font-medium text-lg'>{course.topic + " " + course.courseType}</h2>
        <p className='text-sm line-clamp-2 text-gray-500'>{course.courseLayout.courseSummary}</p>

        <div className='mt-3'>
          <Progress value={progress} />
        </div>

        <div className='mt-4 flex justify-between'>
          <Button variant={'outline'} onClick={DeleteRecord}>Delete</Button>
          <Link href={`/course/ ${course.courseId}`}>
            <Button>View</Button>
          </Link>
        </div>


      </div>
    </div>
  )
}

export default CourseCardItem