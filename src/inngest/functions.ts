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
    const { course } = event.data;
    const chapters = course.courseLayout.chapters;

    // Logic: Map chapters to a set of new events and fire them all at once.
    // This function will finish in milliseconds, avoiding any timeout.
    await step.sendEvent('dispatch-chapter-jobs',
      chapters.map((chapter: any, index: number) => ({
        name: 'chapter.generate.task',
        data: {
          chapter: chapter,
          index: index,
          courseId: course.courseId,
          // We pass the full course object if needed, or just the ID
        }
      }))
    );

    return { message: `Dispatched ${chapters.length} chapters for generation.` };
  }
);

export const GenerateSingleChapterNotes = inngest.createFunction(
  { id: 'generate-single-chapter-notes' },
  { event: 'chapter.generate.task' },
  async ({ event, step }) => {
    const { chapter, index, courseId } = event.data;

    await step.run('Generate Notes via AI', async () => {
      const PROMPT = `Generate detailed content in JSON format in one line in non readable format...
      Use the provided chapter details: ${JSON.stringify(chapter)}.`;

      // Using Gemini 1.5 Flash here is mandatory for speed.
      const result = await generateNotesAiModel.sendMessage(PROMPT);
      const rawText = result.response.text();

      // Clean the response: AI sometimes wraps JSON in markdown blocks
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      const aiResp = JSON.parse(cleanJson);

      // Insert into DB
      await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId: index,
        courseId: courseId,
        notes: aiResp,
        status: 'Ready',
      });
    });

    return { success: true, chapterIndex: index };
  }
);



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
