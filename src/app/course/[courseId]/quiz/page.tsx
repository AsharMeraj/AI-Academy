'use client'
import { QuizDataType, QuizData } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import QuizCardItem from './_components/QuizCardItem'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

const QuizPage = () => {
  const { courseId } = useParams()

  // Logic: Initializing with null and checking for it prevents "undefined" crashes
  const [quizData, setQuizData] = useState<QuizData[] | null>(null)
  const [stepCount, setStepCount] = useState<number>(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

 const GetQuiz = useCallback(async () => {
  if (!courseId) return;

  try {
    const response = await fetch('/api/study-type', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, studyType: 'quiz' }),
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    const record = data.quiz;

    // Keep spinner on while generating
    if (record?.status === 'Generating' || !record?.content) {
      setTimeout(() => GetQuiz(), 3000);
      return;
    }

    const actualQuestions = record?.content?.quiz;

    if (Array.isArray(actualQuestions)) {
      setQuizData(actualQuestions);
    } else {
      console.error("Data structure mismatch. Received:", data);
      setQuizData([]);
    }
    setLoading(false); // 👈 only when data is ready
  } catch (error) {
    console.error("Quiz Fetch Error:", error);
    setQuizData([]);
    setLoading(false);
  }
  // 👈 no finally block
}, [courseId]);

  console.log(quizData)

  useEffect(() => {
    GetQuiz();
  }, [GetQuiz]);

  useEffect(() => {
    setIsCorrect(null);
  }, [stepCount]);

  const checkAnswer = (userAnswer: string) => {
    const correctAnswer = quizData?.[stepCount]?.answer;

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-gray-500 mt-2">Preparing your quiz...</p>
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No quiz questions found.</p>
      </div>
    );
  }

  const currentQuestion = quizData[stepCount];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className='font-bold text-2xl'>Quiz</h2>
      <p className="text-gray-600 mb-6">Test your knowledge and see what stuck.</p>

      {/* Dynamic Progress Bar */}
      <div className='flex gap-2 md:gap-4 items-center mb-8'>
        <Button
          onClick={() => setStepCount(prev => Math.max(0, prev - 1))}
          disabled={stepCount === 0}
          variant={'outline'}
          size={'sm'}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex flex-1 gap-1">
          {Array.isArray(quizData) && quizData.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>

        <Button
          onClick={() => setStepCount(prev => Math.min(quizData.length - 1, prev + 1))}
          disabled={stepCount === quizData.length - 1}
          variant={'outline'}
          size={'sm'}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="min-h-[300px]">
        <QuizCardItem
          checkAnswer={checkAnswer}
          quiz={currentQuestion}
        />
      </div>

      {/* Feedback Section */}
      <div className="mt-6 min-h-[80px]">
        {isCorrect === true && (
          <div className='border p-4 border-green-700 rounded-xl bg-green-50 animate-in zoom-in-95 duration-300'>
            <h2 className='font-bold text-lg text-green-700'>Correct!</h2>
            <p className='text-green-600'>Great job, that is the right answer.</p>
          </div>
        )}

        {isCorrect === false && (
          <div className='border p-4 border-red-700 rounded-xl bg-red-50 animate-in zoom-in-95 duration-300'>
            <h2 className='font-bold text-lg text-red-700'>Incorrect!</h2>
            <p className='text-red-700'>
              The correct answer was: <span className="font-bold">{currentQuestion?.answer}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage;