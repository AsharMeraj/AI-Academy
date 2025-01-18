'use client';
import React, { useContext, useEffect, useState } from 'react';
import MaterialCardItem from './MaterialCardItem';
import axios from 'axios';
import { NotesResult, result } from '@/app/_types/Types';
import { ResultDataContext } from '@/app/_context/CourseCountContext';

const StudyMaterialSection = ({ course }: { course: result }) => {
    const [studyTypeContent, setStudyTypeContent] = useState<NotesResult>({} as NotesResult);
    const [notesLoading, setNotesLoading] = useState<boolean>(false);

    const context = useContext(ResultDataContext);
    if (!context) {
        throw new Error('CourseCountContext must be used within its Provider');
    }

    const { Result, setResult } = context

    // const handleDelete = (data: NotesResult) => {
    //     setStudyTypeContent((prev) => ({ ...prev, data }));
    // };

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

    useEffect(() => {
        if (course.courseId) {
            GetStudyNotes();
        }
    }, [course.courseId]);

    const GetStudyNotes = async () => {
        try {
            const response = await axios.post('/api/study-type', {
                courseId: course.courseId,
                studyType: 'ALL',
            });
            const data = response.data;

            if (data?.result) {
                setResult(data.result);
                console.log(Result)
            } else {
                console.warn('Result not found in the API response');
            }
            console.log(data)
            setStudyTypeContent(data);
            console.log('Updated Result:', data.result);
        } catch (error) {
            console.error('Error fetching study notes:', error);
        }
    };


    return (
        <div>
            <h2 className="font-medium text-xl mt-3">Study Material</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-3">
                {materialList.map((item, index) => (
                    <MaterialCardItem
                        notesLoading={notesLoading}
                        setNotesLoading={setNotesLoading}
                        refreshData={GetStudyNotes}
                        course={course}
                        studyTypeContent={studyTypeContent.result}
                        key={index}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
};

export default StudyMaterialSection;
