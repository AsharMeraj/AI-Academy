import { flashCardAiResultType } from '@/app/_types/Types'
import React from 'react'
import ReactCardFlip from 'react-card-flip'

interface Proptype  {
    isFlipped: boolean
    handleClick: () => void
    flashcard: flashCardAiResultType
}

const FlashcardItems = (props: Proptype) => {
  return (
    <ReactCardFlip isFlipped={props.isFlipped} flipDirection="vertical">
        <div className='text-center p-4 bg-primary shadow-lg text-white flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]' onClick={props.handleClick}>
            <h2>{props.flashcard.front}</h2>
        </div>

        <div className='text-center p-4 bg-white shadow-lg text-primary flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[200px] md:h-[350px] md:w-[300px]' onClick={props.handleClick}>
            <h2>{props.flashcard.back}</h2>
        </div>
      </ReactCardFlip>
  )
}

export default FlashcardItems