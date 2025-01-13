'use client'
import { flashCardDataType } from '@/app/_types/Types'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FlashcardItems from './_components/FlashcardItems'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const Flashcards = () => {
  const { courseId } = useParams()
  const [flashcardData, setFlashcardData] = useState<flashCardDataType[]>([])
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [api, setApi] = useState<CarouselApi>()
  const [stepCount, setStepCount] = useState<number>(0)

  useEffect(() => {
    GetFlashCards()
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    // Update the stepCount whenever a carousel item is selected
    api.on('select', () => {
      const currentIndex = api.selectedScrollSnap
      setStepCount(currentIndex)
      setIsFlipped(false)
    })
  }, [api])

  const GetFlashCards = async () => {
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'flashcard'
    })
    console.log(result.data)
    setFlashcardData(result.data.flashcard)
  }

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div>
      <h2 className='font-bold text-2xl'>Flashcards</h2>
      <p>Flashcards: The Ultimate tool to lock in concept</p>
      <div className='flex gap-5 items-center mt-8'>
        
        {flashcardData[0]?.content?.map((item, index) => (
          <div key={index} className={`w-full h-2 rounded-full ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`} />
        ))}
        
      </div>

      <div className='mt-10'>
        <Carousel setApi={setApi}>
          <CarouselContent>
            {flashcardData[0]?.content.map((flashcard, index) => (
              <CarouselItem key={index} className='flex items-center justify-center'>
                <FlashcardItems flashcard={flashcard} isFlipped={isFlipped} handleClick={handleClick} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </div>
  )
}

export default Flashcards
