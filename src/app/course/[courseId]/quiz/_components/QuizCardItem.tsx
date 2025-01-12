import { QuizData } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const QuizCardItem = ({ quiz, checkAnswer }: { quiz: QuizData, checkAnswer: (option: string, correctAnswer: string) => void }) => {

    const [selectedOption, setSelectedOption] = useState<string>()
    return (
        <div className='mt-10 p-5'>
            <h2 className='font-medium text-2xl text-center'>{quiz?.question}</h2>
            <div className='grid grid-cols-2 gap-8 mt-8'>
                {quiz?.options?.map((option, index) => (
                    <h2
                        onClick={() => {
                            setSelectedOption(option)
                            checkAnswer(option, quiz.answer)

                        }}
                        key={index}
                        className={`w-full border rounded-full p-3 px-4 text-center  hover:bg-gray-200 cursor-pointer ${selectedOption===option&&'bg-primary text-white hover:bg-primary'}`}>
                        {option}
                    </h2>
                ))}
            </div>
        </div>
    )
}

export default QuizCardItem