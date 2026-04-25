'use client'
import { flashCardDataType } from '@/app/_types/Types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import FlashcardItems from './_components/FlashcardItems'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Loader2 } from 'lucide-react'

const Flashcards = () => {
  const { courseId } = useParams()
  const [flashcardData, setFlashcardData] = useState<flashCardDataType[]>([])
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [api, setApi] = useState<CarouselApi>()
  const [stepCount, setStepCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const GetFlashCards = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/study-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, studyType: 'flashcard' }),
      });

      if (!response.ok) throw new Error('Failed to fetch flashcards');

      const data = await response.json();
      const record = data.flashcard?.[0];

      // ✅ If still generating, poll every 3 seconds
      if (record?.status === 'Generating' || !record?.content) {
        setTimeout(() => GetFlashCards(), 3000);
        return;
      }

      setFlashcardData(data.flashcard || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) GetFlashCards();
  }, [courseId, GetFlashCards]);

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
      setStepCount(api.selectedScrollSnap());
      setIsFlipped(false);
    });
  }, [api]);

  const cards = flashcardData[0]?.content || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-gray-500 mt-2">Loading your flashcards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">No flashcards found for this course.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='font-bold text-2xl'>Flashcards</h2>
      <p className='text-gray-600'>Flashcards: The ultimate tool to lock in concepts</p>

      <div className='flex gap-2 md:gap-4 items-center mt-8'>
        {cards.map((_: any, index: number) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              index <= stepCount ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className='mt-10 relative px-12'>
        <Carousel setApi={setApi} className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {cards.map((flashcard: any, index: number) => (
              <CarouselItem key={index} className='flex items-center justify-center'>
                <FlashcardItems
                  flashcard={flashcard}
                  isFlipped={isFlipped}
                  handleClick={() => setIsFlipped(!isFlipped)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  )
}

export default Flashcards;