'use client'
import { NotesType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ViewNotes = () => {
    const { courseId } = useParams()
    const [notes, setNotes] = useState<NotesType[]>([])
    const [stepCount, setStepCount] = useState<number>(0)
    // Clean and parse deeply escaped JSON strings
    // const cleanedString = notes[stepCount] && JSON.parse(notes[stepCount])?.content
    //     ?.replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    //     .replace(/\\/g, '\\\\') // Escape backslashes
    //     .replace(/"/g, '\\"') // Escape double quotes
    //     .replace(/'/g, "\\'")
    //     .replace(/\\{2}/g, '\\'); // Escape single quotes for additional safety

    // const parsedString = cleanedString ? JSON.parse(cleanedString) : null;
    // const actualNotes = parsedString;


    useEffect(() => {
        GetNotes()
    }, [])

    const GetNotes = async () => {
        if (courseId) {
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'notes'
            })
            setNotes(result.data.Notes)
            console.log(result.data.Notes)

        }
    }
    console.log(notes)
    return (
        <div>
            <div className='flex gap-5 items-center'>
                <Button
                    onClick={() => {
                        if (stepCount !== 0)
                            setStepCount(stepCount - 1)
                    }}
                    variant={'outline'}
                    size={'sm'}>
                    Previous
                </Button>
                {
                    notes.map((note, index) => (
                        <div key={index} className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}>
                        </div>
                    ))
                }

                {/* <div key={index} className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}>
                </div> */}


                <Button
                    onClick={() => {
                        if (stepCount !== notes.length-1)
                            setStepCount(stepCount + 1)
                    }}
                    variant={'outline'}
                    size={'sm'}>
                    Next
                </Button>
            </div>

            <div className='mt-10'>
                <div dangerouslySetInnerHTML={{ __html: notes[stepCount]?.notes[0]?.content }} />
            </div>
        </div>
    )
}

export default ViewNotes