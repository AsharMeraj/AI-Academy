'use client'
import { QuizDataType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuizCardItem from './_components/QuizCardItem'

const page = () => {
  const { courseId } = useParams()
  const [quizData, setQuizData] = useState<QuizDataType>(Object)
  const [stepCount, setStepCount] = useState<number>(0)
  const [checkCorrectAnswer, setCheckCorrectAnswer] = useState<boolean | null>(null)
  const [CorrectAnswer, setCorrectAnswer] = useState<string | null>(null)
  useEffect(() => {
    GetQuiz()
  }, [])

  const GetQuiz = async () => {
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'quiz'
    })
    setQuizData(result.data.quiz.content)
  }


  useEffect(() => {
    setCheckCorrectAnswer(null)
    setCorrectAnswer(null)
  }, [stepCount])

  const checkAnswer = (userAnswer: string, correctAnswer: string) => {
    console.log("userAnswer: " + userAnswer, "correctAnswer: " + correctAnswer)
    if (userAnswer === correctAnswer) {
      setCheckCorrectAnswer(true)
      setCorrectAnswer(correctAnswer)
      return;
    }
    else {
      setCheckCorrectAnswer(false)
    }
  }
  return (
    <div>
      <h2 className='font-bold text-2xl'>Quiz</h2>
      <p>Quiz: Great way to test your knowledge</p>

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
        {quizData?.quiz?.map((item, index) => (
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
        <QuizCardItem checkAnswer={(v) => checkAnswer(v, quizData?.quiz?.[stepCount].answer)} quiz={quizData?.quiz?.[stepCount]} />
      </div>

      {CorrectAnswer || checkCorrectAnswer !== null ?
        <div>
          {
            checkCorrectAnswer === false ?
              <div className='border p-3 border-red-700 rounded-lg bg-red-100'>
                <h2 className='font-bold text-lg text-red-700'>Incorrect!</h2>
                <p className='text-red-700'>The correct answer is: {CorrectAnswer}</p>
              </div>
              :
              <div className='border p-3 border-green-700 rounded-lg bg-green-100'>
                <h2 className='font-bold text-lg text-green-700'>Correct!</h2>
                <p className='text-green-700'>Your answer is correct</p>
              </div>
          }
        </div> :
        <div></div>}
    </div>
  )
}

export default page