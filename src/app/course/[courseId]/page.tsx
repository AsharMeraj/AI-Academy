'use client'
import { result } from '@/app/_types/Types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import CourseIntroCard from './notes/_components/CourseIntroCard'
import StudyMaterialSection from './notes/_components/StudyMaterialSection'
import ChapterList from './notes/_components/ChapterList'
import { Loader2 } from 'lucide-react'

const Course = () => {
    const { courseId } = useParams()
    // Logic: Start with null to prevent child components from crashing on undefined properties
    const [course, setCourse] = useState<result | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const GetCourse = useCallback(async () => {
        if (typeof courseId !== 'string') return

        try {
            setLoading(true)
            const response = await fetch(`/api/courses?courseId=${courseId}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch course')
            }

            const data = await response.json()
            setCourse(data.result)
        } catch (error) {
            console.error("Error fetching course:", error)
        } finally {
            setLoading(false)
        }
    }, [courseId])

    useEffect(() => {
        GetCourse()
    }, [GetCourse])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-gray-500 mt-4 font-medium">Loading Course Details...</p>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-700">Course not found</h2>
                <p className="text-gray-500">The requested course could not be loaded.</p>
            </div>
        )
    }

    return (
        <div className="pb-10">
            {/* Course Intro */}
            <CourseIntroCard course={course} />

            {/* Study Material Options */}
            <StudyMaterialSection course={course} />

            {/* Chapters List */}
            <ChapterList course={course} />
        </div>
    )
}

export default Course