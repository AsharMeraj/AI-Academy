import { result } from '@/app/_types/Types'
import React from 'react'

const ChapterList = ({ course }: { course: result }) => {

  return (
    <div className='mt-5'>
      <h2 className='font-medium text-xl mt-3'>Chapters</h2>

      <div className='mt-3'>
        {course?.courseLayout?.chapters.map((chapter, index) => (
          <div className='flex flex-col md:flex-row gap-5 items-start md:items-center p-4 border shadow-md mb-2 rounded-lg' key={index}>
            <h2 className='text-4xl'>{chapter.emoji}</h2>
            <div>
              <h2 className='font-medium text-gray-800'>{chapter.chapterTitle}</h2>
              <p className='text-gray-500 text-sm'>{chapter.chapterSummary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterList