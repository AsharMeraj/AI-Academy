'use client'
import React, { useContext, useState } from 'react'
import { CourseCountContext } from './_context/CourseCountContext'

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
    const [totalCourse, setTotalCourse] = useState<number>(0);
    const [ProgressPercentage, setProgressPercentage] = useState<Record<string, number>>({});
    return (
        <CourseCountContext.Provider value={{totalCourse, setTotalCourse, ProgressPercentage, setProgressPercentage}}>
            {children}
        </CourseCountContext.Provider >
    )
}

export default ContextWrapper