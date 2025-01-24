import { AIGeneratedNotesType, chapters } from "./NotesGenerateType";

export interface StudyMaterial {
    courseSummary: string;
    chapters: Chapter[];
}

export interface Chapter {
    chapterTitle: string;
    emoji: string,
    chapterSummary: string;
    topics: string[];
}

export interface NotesChapter {
    content: string
}

export interface result {
    courseId: string,
    courseLayout: StudyMaterial,
    courseType: string,
    createdBy: string,
    difficultyLevel: string,
    id: number,
    topic: string
    status: string,
    progress: number
}

export interface NotesResult {
    result: Notes
}

export interface NotesType {
    chapterId: number,
    courseId: string,
    id: number,
    notes: AIGeneratedNotesType
    status: string,
    type: string
} 
export interface Notes {
    notes: AIGeneratedNotesType[],
    flashcard: flashCardAiResultType[],
    quiz: QuizData[],
    qa: QaResultType[]
}

export interface flashCardAiResultType {
    front: string,
    back: string,
}

export interface flashCardDataType {
    content: flashCardAiResultType[],
    courseId: string,
    id: number,
    status: string,
    type: string
}

export interface QuizData {
    answer: string,
    options: string[],
    question: string
}
export interface QuizDataType {
    quiz: QuizData[],
}

export interface QaResultType {
    answer: string,
    question: string
}

export interface UserType {
    customerId: string | null,
    email: string,
    id: number,
    isMember: boolean,
    name: string
}