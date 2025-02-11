import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "@/configs/schema";
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
)

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course }: { course: result } = event.data;

    // Extract chapters from the course layout
    const Chapters = course.courseLayout.chapters;

    // Log the chapters for debugging
    console.log("Chapters to generate notes for:", Chapters);
    for (const [index, chapter] of Chapters.entries()) {
      console.log("Chapter Index: " + index)
      await step.run('Generate Chapter Notes', async () => {
        try {
          const PROMPT =
            `Generate detailed content in JSON format in one line in non readable format, The output should contain an object with a key-value pair chapters, where the chapter is an object. The chapter should include:
            heading: Main heading of the chapter with given emoji an the end.
            headingPara: A paragraph explaining the chapter's topic.
            subheadings: An array of 4 objects, each with:
            subheading: Title of the subheading.
            subheadingPara: A short paragraph (up to 1 line if the chapter is about programming, otherwise up to 3 lines)..
            codeBlock: Complete HTML code (make sure to add string in backticks instead of quotation) with proper spaces not in one line, in all subheadings (if the chapter is about programming, otherwise make it blank), styled with: background-color: #f3f4f6 padding: 1.5rem border-radius: 8px font-family: monospace font-size: 14px overflow-x: auto width: 100% margin-bottom: 1.5rem
            Ensure clean, consistent, and engaging content.
            Use the provided chapter details: ${JSON.stringify(chapter)}.`

          // Call the AI model to generate notes
          const result = await generateNotesAiModel.sendMessage(PROMPT);

          console.log(result.response.text())
          // Parse the AI response
          const aiResp = JSON.parse(result.response.text());

          // Insert generated notes into the database
          await db.insert(CHAPTER_NOTES_TABLE).values({
            chapterId: index, // Use index as chapterId
            courseId: course.courseId,
            notes: aiResp,
            status: 'Ready',
          });
        } catch (error) {
          console.error(`Failed to generate:`, error);
        }
      });
    }
  });;



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
