'use client'
import { chapters } from '@/app/_types/NotesGenerateType'
import { NotesType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ViewNotes = () => {
    const { courseId } = useParams()
    const [notes, setNotes] = useState<NotesType[]>([])
    const [stepCount, setStepCount] = useState<number>(0)
    
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
    console.log(notes[stepCount]?.notes.chapters)
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
                    notes?.map((note, index) => (
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
                <h1 className='text-3xl font-bold text-black mb-2'>{notes[stepCount]?.notes.chapters.heading}</h1>
                <p className='p-2 mb-8  text-sm'>{notes[stepCount]?.notes?.chapters?.headingPara}</p>
                {
                    notes[stepCount]?.notes?.chapters?.subheadings.map((item,index) => (
                        <div key={index} className='mb-6'>
                            <h2 className='text-primary font-bold text-2xl'>{item.subheading}</h2>
                            <p className='p-2  text-sm'>{item.subheadingPara}</p>
                            <div dangerouslySetInnerHTML={{__html: item.codeBlock}}/>
                            {/* <div className='p-6 rounded-md bg-gray-100 overflow-x-auto w-full'>
                                <p className=' text-sm'>{item.codeBlock}</p>
                            </div> */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ViewNotes