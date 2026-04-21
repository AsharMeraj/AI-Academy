'use client'
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'
import TopicInput from './_components/TopicInput'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './_components/CustomLoading'
import { useRouter } from 'next/navigation'
import DashboardHeader from '../dashboard/_components/DashboardHeader'
import { toast } from 'sonner'

// Fixed: Corrected type definition for an object, not an array
type formDataType = Record<string, string>;

const Create = () => {
    const { user } = useUser()
    const [step, setStep] = useState<number>(0)
    // Fixed: Initialized as an empty object to match your handleUserInput logic
    const [formData, setFormData] = useState<formDataType>({})
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const handleUserInput = (fieldName: string, fieldValue: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: fieldValue }))
    }

    const GenerateCourseOutline = async () => {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
            toast.error("User email not found. Please sign in again.");
            return;
        }

        setLoading(true)
        const courseId = uuidv4()
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        try {
            const response = await fetch('/api/generate-course-outline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId: courseId,
                    ...formData,
                    createdBy: email,
                    date: currentDate
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to initiate course generation");
            }

            // Success
            toast('Your course content is generating... Do not Refresh');
            router.replace('/dashboard');
        } catch (error) {
            console.error("Generation Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DashboardHeader />
            <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20 max-w-5xl lg:mx-auto'>
                <h2 className='font-bold text-4xl text-center md:text-start text-primary'>
                    Start building your personal study material
                </h2>
                <p className='text-gray-500 text-lg text-center md:text-start'>
                    Fill all details in order to generate study material for your next project
                </p>

                <div className='mt-10'>
                    {step === 0 ? (
                        <SelectOption selectedStudyType={(value) => handleUserInput('courseType', value)} />
                    ) : (
                        <TopicInput
                            setTopic={(value) => handleUserInput('topic', value)}
                            setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                        />
                    )}
                </div>

                <div className='flex justify-between w-full mt-32'>
                    {step !== 0 ? (
                        <Button variant={'outline'} onClick={() => setStep(step - 1)}>
                            Previous
                        </Button>
                    ) : (
                        <div className='w-20' /> /* Placeholder for alignment */
                    )}
                    
                    {step === 0 ? (
                        <Button onClick={() => setStep(step + 1)}>Next</Button>
                    ) : (
                        <Button onClick={GenerateCourseOutline} disabled={loading}>
                            {loading ? "Processing..." : "Generate"}
                        </Button>
                    )}
                </div>
                <CustomLoading loading={loading} />
            </div>
        </>
    )
}

export default Create;