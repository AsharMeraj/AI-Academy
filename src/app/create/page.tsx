'use client'
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'
import TopicInput from './_components/TopicInput'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './_components/CustomLoading'
import { useRouter } from 'next/navigation'
import DashboardHeader from '../dashboard/_components/DashboardHeader'
import { toast } from 'sonner'

type formDataType = {
    [x: string]: string
}

const Create = () => {

    const { user } = useUser()

    const [step, setStep] = useState<number>(0)
    const [formData, setFormData] = useState<formDataType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()


    const handleUserInput = (fieldName: string, fieldValue: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: fieldValue }))
    }

    const GenerateCourseOutline = async () => {
        setLoading(true)
        const courseId = uuidv4()
        if (user?.primaryEmailAddress?.emailAddress) {
            await axios.post('/api/generate-course-outline', {
                courseId: courseId,
                ...formData,
                createdBy: user.primaryEmailAddress.emailAddress
            })

        }
        setLoading(false)
        router.replace('/dashboard')
        toast('Your course content is generating...Do not Refresh')
    }

    return (
        <>
        <DashboardHeader/>
            <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
                <h2 className='font-bold text-4xl text-primary'>Start building your personal study material</h2>
                <p className='text-gray-500 text-lg'>Fill all details in order to generate study material for your next project</p>

                <div className='mt-10'>
                    {step === 0 ?
                        <SelectOption selectedStudyType={(value) => handleUserInput('courseType', value)} />
                        : <TopicInput
                            setTopic={(value) => handleUserInput('topic', value)}
                            setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}

                        />}
                </div>
                <div className='flex justify-between w-full mt-32'>
                    {step !== 0 ?
                        <Button variant={'outline'} onClick={() => setStep(step - 1)}>Previous</Button>
                        : <h2 className='text-white'>-</h2>}
                    {step === 0 ?
                        <Button onClick={() => setStep(step + 1)}>Next</Button>
                        : <Button onClick={GenerateCourseOutline}>Generate</Button>}
                </div>
                <CustomLoading loading={loading} />
            </div>
        </>
    )
}

export default Create