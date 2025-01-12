'use client'
import { result } from '@/app/_types/Types'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseIntroCard from './notes/_components/CourseIntroCard'
import StudyMaterialSection from './notes/_components/StudyMaterialSection'
import ChapterList from './notes/_components/ChapterList'

const Course = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<result>(Object)

    useEffect(() => {
        GetCourse()
    }, [])

    const GetCourse = async () => {
        if (typeof courseId === 'string') {
            const result = await axios.get('/api/courses?courseId=' + courseId)
            setCourse(result.data.result)
        }
    }

    return (
        <div>
            <div>
                {/* Course Intro */}
                <CourseIntroCard course={course} />

                {/* Study Material Options */}
                <StudyMaterialSection course={course}/>

                {/* Chapters List */}
                <ChapterList course={course}/>
            </div>


        </div>
    )
}

export default Course