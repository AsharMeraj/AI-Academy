'use client'
import { NotesType } from '@/app/_types/Types'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

const ViewNotes = () => {
    const { courseId } = useParams()
    const [notes, setNotes] = useState<NotesType[]>([])
    const [stepCount, setStepCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true) // 👈 true: fetch on mount

    const GetNotes = useCallback(async () => {
        if (!courseId) return;
        
        setLoading(true)
        try {
            const response = await fetch('/api/study-type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, studyType: 'notes' }),
            });

            if (!response.ok) throw new Error('Failed to fetch notes');

            const data = await response.json();
            setNotes(data.notes || []);
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // ✅ Auto-fetch on mount — "View" click is already the user's intent
    useEffect(() => {
        GetNotes();
    }, [GetNotes]);

    const currentChapter = notes[stepCount]?.notes?.chapters;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-gray-500 mt-2">Loading study material...</p>
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="text-center mt-10 p-10 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">No notes found. They might still be generating.</p>
                <Button onClick={GetNotes} variant="outline" className="mt-4">Retry</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className='flex gap-5 items-center bg-white sticky top-0 py-4 z-10 border-b mb-6'>
                <Button
                    onClick={() => setStepCount(prev => Math.max(0, prev - 1))}
                    disabled={stepCount === 0}
                    variant={'outline'}
                    size={'sm'}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex flex-1 gap-2">
                    {notes.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 flex-1 rounded-full transition-all ${
                                index <= stepCount ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>

                <Button
                    onClick={() => setStepCount(prev => Math.min(notes.length - 1, prev + 1))}
                    disabled={stepCount === notes.length - 1}
                    variant={'outline'}
                    size={'sm'}
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {currentChapter && (
                <div className='mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                    <h1 className='text-3xl md:text-4xl font-extrabold text-black mb-4'>
                        {currentChapter.heading}
                    </h1>
                    <p className='p-2 mb-10 text-gray-700 leading-relaxed'>
                        {currentChapter.headingPara}
                    </p>

                    <div className="space-y-12">
                        {currentChapter.subheadings.map((item, index) => (
                            <div key={index} className='group'>
                                <h2 className='text-primary font-bold text-2xl mb-3 flex items-center'>
                                    <span className="mr-3 text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                        0{index + 1}
                                    </span>
                                    {item.subheading}
                                </h2>
                                <p className='p-2 text-gray-600 mb-4 leading-relaxed'>
                                    {item.subheadingPara}
                                </p>

                                {item.codeBlock && (
                                    <div
                                        className="rounded-lg shadow-sm"
                                        dangerouslySetInnerHTML={{ __html: item.codeBlock }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewNotes;