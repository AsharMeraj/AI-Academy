'use client'
import { QaResultType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

const QuestionAnswers = () => {
  const { courseId } = useParams()
  const [stepCount, setStepCount] = useState<number>(0)
  const [qaResult, setQaResult] = useState<QaResultType[]>([])
  const [checkOpen, setCheckOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const GetQa = useCallback(async () => {
  if (!courseId) return;

  try {
    const response = await fetch('/api/study-type', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, studyType: 'qa' }),
    });

    if (!response.ok) throw new Error('Failed to fetch QA data');

    const data = await response.json();
    const record = data.qa;

    if (record?.status === 'Generating' || !record?.content) {
      setTimeout(() => GetQa(), 3000);
      return; // 👈 keep spinner on, don't setLoading(false)
    }

    setQaResult(record?.content || []);
    setLoading(false); // 👈 only stop loading when data is ready
  } catch (error) {
    console.error("QA Fetch Error:", error);
    setLoading(false);
  }
}, [courseId]);

  useEffect(() => {
    GetQa();
  }, [GetQa]);

  // Close the answer whenever the user moves to a new question
  useEffect(() => {
    setCheckOpen(false);
  }, [stepCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-gray-500 mt-2">Loading practice questions...</p>
      </div>
    );
  }

  if (qaResult.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-xl">
        <p className="text-gray-500">No questions found for this course.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className='font-bold text-2xl'>Question and Answers</h2>
      <p className="text-gray-600">Practice your learning and test your knowledge</p>
      
      {/* Dynamic Progress Bar & Navigation */}
      <div className='flex gap-3 md:gap-5 items-center mt-6'>
        <Button
          onClick={() => setStepCount(prev => Math.max(0, prev - 1))}
          disabled={stepCount === 0}
          variant={'outline'}
          size={'sm'}
        >
          Previous
        </Button>

        <div className="flex flex-1 gap-2">
          {qaResult.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index <= stepCount ? 'bg-primary' : 'bg-gray-200'
              }`} 
            />
          ))}
        </div>

        <Button
          onClick={() => setStepCount(prev => Math.min(qaResult.length - 1, prev + 1))}
          disabled={stepCount === qaResult.length - 1}
          variant={'outline'}
          size={'sm'}
        >
          Next
        </Button>
      </div>

      {/* Question Area */}
      <div className="mt-8">
        <Collapsible open={checkOpen} onOpenChange={setCheckOpen}>
          <CollapsibleTrigger className='p-6 bg-white border border-gray-200 shadow-sm hover:border-primary/50 transition-colors rounded-xl text-left flex justify-between items-center gap-7 w-full group'>
            <h2 className="text-lg font-medium leading-tight">
              <span className="text-primary font-bold mr-2">Q{stepCount + 1}:</span> 
              {qaResult[stepCount]?.question}
            </h2>
            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              {checkOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
            <div className='mt-4 rounded-xl p-6 border-l-4 border-green-600 bg-green-50 text-green-900 shadow-sm'>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 text-green-700">Answer</h3>
              <p className="text-base leading-relaxed">
                {qaResult[stepCount]?.answer}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default QuestionAnswers;