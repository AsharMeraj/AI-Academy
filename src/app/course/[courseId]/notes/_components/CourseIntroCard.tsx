'use client'
import { ResultDataContext } from '@/app/_context/CourseCountContext'
import { result } from '@/app/_types/Types'
import { Progress } from '@/components/ui/progress'
import { db } from '@/configs/db'
import { STUDY_MATERIAL_TABLE } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'

const CourseIntroCard = ({ course }: { course: result }) => {
  const { Result, setResult } = useContext(ResultDataContext)
  const [progress, setProgress] = useState<number>(0)
  console.log(progress)

  useEffect(() => {
    const filledKeys = Object.values(Result).filter(value => value && value.length > 0).length;
    const totalKeys = Object.keys(Result).length;
    
    const progressPercentage = (filledKeys / totalKeys) * 100;

    const UpdateProgress = async () => {
      await db.update(STUDY_MATERIAL_TABLE).set({
        progress: progressPercentage?progressPercentage:0
      }).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId))
      const progressResult = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId))

      console.log(progressResult[0]?.progress)
      progressResult[0]?.progress&&setProgress(progressResult[0].progress)
    }

    UpdateProgress()
    console.log(course.progress)

  }, [Result, course.courseId]);

  return (
    <div className='flex gap-5 items-center p-8 border shadow-md rounded-lg'>
      <Image src={'/knowledge.png'} alt='other' width={100} height={100} />
      <div>
        <h2 className='font-bold text-2xl'>{course.topic}</h2>
        <p className='text-gray-500 mt-1'>{course?.courseLayout?.courseSummary}</p>
        <Progress value={progress} className='mt-3' />
        <h2 className='mt-3 text-lg text-primary'>Total Chapters: {course?.courseLayout?.chapters.length}</h2>
      </div>
    </div>
  )
}

export default CourseIntroCard