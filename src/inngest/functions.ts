import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "@/configs/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { result } from "@/app/_types/Types";
import { generateFlashCardsAiModel, generateNotesAiModel, generateQaAiModel, generateQuizAiModel } from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    console.log("Function triggered with event:", event);
    return { message: `Asalam u Alikum ${event.data.email}!` };
  },
);

export const CreateNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user.create' },
  async ({ event, step }) => {
    const { user } = event.data
    await step.run('Check use and create new if not', async () => {
      if (user?.primaryEmailAddress?.emailAddress && user.fullName) {

        const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))
        if (result.length === 0) {

          const data = {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
          }

          const userResp = await db.insert(USER_TABLE).values(data).returning({ id: USER_TABLE.id })

          return userResp
        }
        return result
      }
    })
    return "Success"
  }

  // Step to send email notification

  // Step to send email notification after 3 days
)

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course }: { course: result } = event.data

    // Generate Notes with each chapter with AI

    await step.run('Generate Chapter Notes', async () => {
      const index = 0
      const chapter = ['']
      course.courseLayout.chapters.map((chap) => {
        chapter.push(JSON.stringify(chap))
      })

      console.log('Chapter: ' + chapter)
      const PROMPT =
        `Generate detailed exam material content as a JSON array of objects, each containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
        Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
        Subheadings: Include up to 6 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
        Paragraphs: Add paragraphs in every subheadings styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
        Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
        Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
        Don't add any bad control or bad escape charactor in string literal.
        Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chapter)} `

      const result = await generateNotesAiModel.sendMessage(PROMPT)
      const aiResp = JSON.parse(result.response.text())
      console.log(aiResp)

      await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId: index,
        courseId: course.courseId,
        notes: aiResp,
        status: "Ready"
      })



      return "Completed!"
    })

    await step.run('Update course status to ready', async () => {
      db.update(STUDY_MATERIAL_TABLE).set({
        status: 'Ready'
      }).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId))
    })

  }
)

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: 'Generate Study Type Content' },
  { event: 'studyType.content' },

  async ({ event, step }) => {
    const { studyType, prompt, recordId } = event.data


    const AiResult = await step.run('Generating flashcard using Ai', async () => {
      const result = studyType === 'flashcard' ? await generateFlashCardsAiModel.sendMessage(prompt) : studyType === 'quiz' ? await generateQuizAiModel.sendMessage(prompt) : await generateQaAiModel.sendMessage(prompt)
      const AIResult = JSON.parse(result.response.text())
      return AIResult
    })

    // Save the Result

    await step.run('Save Result to DB', async () => {
      await db.update(STUDY_TYPE_CONTENT_TABLE).set({
        content: AiResult,
        status: 'Ready',
      }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))

      return 'Data Inserted';
    });

  }
)


// `Generate detailed exam material content for each chapter. Format the content as a key-value pair with the key being "content" and the value being detailed HTML content styled with inline Tailwind CSS. Ensure:
// All topic points are thoroughly covered in the content.
// The content includes engaging and well-structured text suitable for a website.HTML is written using inline Tailwind CSS for styling.
// Do not include <html>, <head>, <body>, or <title> tags.
// Use the following chapter details: ${JSON.stringify(chapter)}`

// `Generate detailed exam material content for each chapter as a key-value pair with the key "content" and the value as detailed HTML styled with inline Tailwind CSS. Ensure the content is well-structured, visually appealing, and all text, headings, and subheadings are aligned to the start (text-start) for better readability. Main headings should use text-3xl font-bold text-start for clear visibility, subheadings should use text-[#305CDE] font-bold text-xl mb-6 for prominence, and paragraphs should use text-base leading-relaxed with appropriate spacing. If its about coding than add code blocks in every heading as an example if needed. Code blocks should have a clean and readable format styled with bg-gray-100 p-4 rounded-lg font-mono text-sm mb-4. Add appropriate margins (mb-12, mt-8) between sections for improved spacing. Ensure the layout is clean, modern, and mobile-friendly specially the code block and its code should be responsive. Avoid including <html>, <head>, <body>, or <title> tags and any bad escaped characters. Use the following chapter details:${JSON.stringify(chapter)}`

// `Generate detailed exam material content for each chapter as a content key-value pair using HTML styled with Tailwind CSS classes. The expected data should have one object which have content field, and in it we have all the data in string. Ensure the text is clean, sanitized for JSON compatibility, and free of bad escape or control characters. Use text-2xl font-bold text-black mb-6 for main headings, text-xl font-bold text-[#305CDE] mb-1 for short subheadings, and text-base leading-7 p-2 for paragraphs. For code topics, include responsive code blocks styled with bg-gray-100 p-6 rounded-md font-mono text-sm mb-2 overflow-x-auto w-full. Ensure layouts are mobile-friendly with generous margins applied using Tailwind's spacing utilities such as mb-12 mt-8. Exclude <html>, <head>, <body>, and <title> tags and use the provided chapter details to generate the content. ${JSON.stringify(chapter)}.`

// `Generate exam material detail content for each chapter , Make sure to include all topic points in the content, make sure to add subheadings with color "#305CDE" and subheadings's subheading with color black, one main heading with text-align start with color black, make sure to add extra margins and paddings so the code looks more clean, add padding between subheadings's subheadings and para, make sure to give content in HTML format (Do not add HTML, Head, Body, title tag), The Chapters: ${JSON.stringify(chapter)}`