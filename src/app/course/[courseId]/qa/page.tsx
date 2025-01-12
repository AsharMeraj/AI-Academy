'use client'
import { QaResultType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react'


const page = () => {
  const { courseId } = useParams()
  const [stepCount, setStepCount] = useState<number>(0)
  const [qaResult, setQaResult] = useState<QaResultType[]>([])
  const [checkOpen, setCheckOpen] = useState<boolean>(false)
  useEffect(() => {
    GetQa()
  }, [])
  useEffect(() => {
    setCheckOpen(false)
  }, [stepCount])
  const GetQa = async () => {
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'qa'
    })
    console.log(result.data.qa.content)
    setQaResult(result.data.qa.content)
  }
  return (
    <div>
      <h2 className='font-bold text-2xl'>Question and Answers</h2>
      <p>Qa: Help to practice your learning</p>
      <div className='flex gap-5 items-center mt-6'>
        <Button
          onClick={() => {
            if (stepCount !== 0)
              setStepCount(stepCount - 1)
          }}
          variant={'outline'}
          size={'sm'}>
          Previous
        </Button>
        {qaResult.map((item, index) => (
          <div key={index} className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}>
          </div>
        ))}
        <Button
          onClick={() => {
            if (stepCount !== 9)
              setStepCount(stepCount + 1)
          }}
          variant={'outline'}
          size={'sm'}>
          Next
        </Button>
      </div>
      <div>
        <Collapsible open={checkOpen} onOpenChange={setCheckOpen}>
          <CollapsibleTrigger className='p-6 bg-gray-100 shadow-md shadow-black/10 rounded-[0.5rem] my-6 text-left flex justify-between gap-7 w-full'>
            <h2>
              Q: {qaResult?.[stepCount]?.question}
            </h2>
            {
              checkOpen ? 
              <ChevronUp/>
              :
              <ChevronDown />
            }
          </CollapsibleTrigger>
          <CollapsibleContent>
            <h2 className='rounded-lg p-6 border border-green-700 bg-green-100 text-green-700'>
              <strong>Ans:</strong> {qaResult?.[stepCount]?.answer}
            </h2>
          </CollapsibleContent>
        </Collapsible>


      </div>
    </div>
  )
}

export default page