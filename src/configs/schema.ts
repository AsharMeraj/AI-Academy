import { flashCardAiResultType, NotesChapter, QaResultType, QuizData, StudyMaterial } from "@/app/_types/Types";
import { boolean, json, pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable('users', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    isMember: boolean().default(false).notNull(),
    customerId: varchar()
})

export const STUDY_MATERIAL_TABLE = pgTable('studyMaterial', {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    courseType: varchar().notNull(),
    topic: varchar().notNull(),
    difficultyLevel: varchar().default('Beginner'),
    courseLayout: json().$type<StudyMaterial>().notNull(),
    createdBy: varchar().notNull(),
    status: varchar().default('Generating'),
    progress: integer().default(0)
})

export const CHAPTER_NOTES_TABLE = pgTable('chapterNotes', {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    chapterId: integer().notNull(),
    notes: json().$type<NotesChapter[]>().notNull(),
    status: varchar().default('Generating')
})

export const STUDY_TYPE_CONTENT_TABLE = pgTable('studyTypeContent', {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    content: json().$type<flashCardAiResultType[] | QuizData[] | QaResultType[]>(),
    type: varchar().notNull(),
    status: varchar().default('Generating'),
    
})

export const PAYMENT_RECORD_TABLE = pgTable('paymentRecord',{
    id: serial().primaryKey(),
    customerId: varchar(),
    sessionId: varchar()
})

// For study material

// Generate a study material for Python for Exam and level of difficulty will be beginner with summary of course,List of chapters along with summary for each chapter, Topic list for each chapter. All result in JSON format (along with short course tittle in it)



// For notes

// Generate detailed exam material content as a JSON array of objects, each containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
// Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
// Subheadings: Include up to 6 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
// Paragraphs: Add paragraphs in every subheadings styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
// Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
// Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
// Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chapter)}



// For Flashcard

// Generate the flashcards on topic : Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with front back content Maximum 15


// For Quiz

// Generate Quiz on topic: Chapters with Question and options along with correct answer in JSON format, (Max 10)