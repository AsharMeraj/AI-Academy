'use client';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import MaterialCardItem from './MaterialCardItem';
import { NotesResult, result } from '@/app/_types/Types';
import { ResultDataContext } from '@/app/_context/CourseCountContext';

const StudyMaterialSection = ({ course }: { course: result }) => {
    // Logic: Use null instead of lying to TS with `{} as Type`
    const [studyTypeContent, setStudyTypeContent] = useState<NotesResult | null>(null);
    
    // Note: You are passing this to MaterialCardItem, but the child handles its own loading state. 
    // You should probably refactor MaterialCardItem to drop these props entirely.
    const [notesLoading, setNotesLoading] = useState<boolean>(false);

    const context = useContext(ResultDataContext);
    if (!context) {
        throw new Error('ResultDataContext must be used within its Provider');
    }

    // You aren't using `Result` in this component, so only destructure what you need.
    const { setResult } = context;

    const materialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read notes to prepare the topic',
            icon: '/notes.png',
            path: '/notes',
            type: 'notes',
        },
        {
            name: 'Flashcard',
            desc: 'Flashcard to remember the concept',
            icon: '/flashcard.png',
            path: '/flashcard',
            type: 'flashcard',
        },
        {
            name: 'Quiz',
            desc: 'Great way to test your knowledge',
            icon: '/quiz.png',
            path: '/quiz',
            type: 'quiz',
        },
        {
            name: 'Question/Answer',
            desc: 'Help to practice your learning',
            icon: '/qa.png',
            path: '/qa',
            type: 'qa',
        },
    ];

    const GetStudyNotes = useCallback(async () => {
        if (!course?.courseId) return;

        try {
            const response = await fetch('/api/study-type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId: course.courseId,
                    studyType: 'ALL',
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch study notes: ${response.statusText}`);
            }

            const data = await response.json();

            setResult(data.result);
            setStudyTypeContent(data);

        } catch (error) {
            console.error("Error in GetStudyNotes:", error);
        }
    }, [course?.courseId, setResult]); // Added setResult to dependency array for safety

    useEffect(() => {
        if (course?.courseId) {
            GetStudyNotes();
        }
    }, [course?.courseId, GetStudyNotes]);

    return (
        <div>
            <h2 className="font-medium text-xl mt-8">Study Material</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-3">
                {materialList.map((item, index) => (
                    <MaterialCardItem
                        notesLoading={notesLoading}
                        setNotesLoading={setNotesLoading}
                        refreshData={GetStudyNotes}
                        course={course}
                        // Safely pass the data. If it's null, pass null. Don't pass undefined properties.
                        studyTypeContent={studyTypeContent?.result as any ?? null}
                        key={index}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
};

export default StudyMaterialSection;