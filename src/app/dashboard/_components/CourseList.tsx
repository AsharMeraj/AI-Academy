'use client'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import CourseCardItem from './CourseCardItem';
import { result } from '@/app/_types/Types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CourseCountContext } from '@/app/_context/CourseCountContext';
import Link from 'next/link';


const CourseList = () => {
    const { user } = useUser()
    const [courseList, setCourseList] = useState<result[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const { setTotalCourse } = useContext(CourseCountContext)

    const handleDelete = (id: string) => {
        setCourseList((prev) => prev.filter((course) => course.courseId !== id))
    }

    useEffect(() => {
        GetCourseList()
    }, [user])


    const GetCourseList = async () => {
        setLoading(true)
        const result = await axios.post('/api/courses', { createdBy: user?.primaryEmailAddress?.emailAddress })
        setCourseList(result.data.result)
        setTotalCourse(result.data.result.length)
        setLoading(false)
    }

    return (
        <div className='mt-10'>
            <h2 className='font-extrabold text-[1.3rem]  md:text-2xl flex gap-4 flex-col md:flex-row justify-between'>Your study material
                <div className='flex justify-between items-center'>
                    <Button onClick={GetCourseList} className='border-primary text-primary w-fit' variant={'outline'}> <RefreshCw />Refresh</Button>
                    <Link href={'/create'} className='md:hidden'>
                        <Button variant={'outline'}>Create New</Button>
                    </Link>
                </div>
            </h2>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 mt-8 gap-5 max-w-[80rem]'>
                {
                    loading === false ? courseList && courseList.map((item, index) => (
                        <CourseCardItem key={index} course={item} onDelete={handleDelete} />
                    )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CourseList