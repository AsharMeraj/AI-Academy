import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "@/configs/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { generateNotes, generateFlashCards, generateQuiz, generateQa } from "@/configs/AiModel"; // 👈 new imports

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Asalam u Alikum ${event.data.email}!` };
  },
);

export const CreateNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user.create' },
  async ({ event, step }) => {
    const { user } = event.data;
    await step.run('Check user and create new if not', async () => {
      if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
        const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user.primaryEmailAddress.emailAddress));
        if (result.length === 0) {
          const userResp = await db.insert(USER_TABLE).values({
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
          }).returning({ id: USER_TABLE.id });
          return userResp;
        }
        return result;
      }
    });
    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course } = event.data;
    const chapters = course.courseLayout.chapters;

    await step.sendEvent('dispatch-chapter-jobs',
      chapters.map((chapter: any, index: number) => ({
        name: 'chapter.generate.task',
        data: {
          chapter,
          index,
          courseId: course.courseId,
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
      const PROMPT = `Generate detailed content in JSON format in one line in non readable format, The output should contain an object with a key-value pair chapters, where the chapter is an object. The chapter should include:
        heading: Main heading of the chapter with given emoji at the end.
        headingPara: A paragraph explaining the chapter's topic.
        subheadings: An array of 4 objects, each with:
        subheading: Title of the subheading.
        subheadingPara: A short paragraph (up to 1 line if programming, otherwise up to 3 lines).
        codeBlock: Complete HTML code with proper spaces, styled with: background-color: #f3f4f6 padding: 1.5rem border-radius: 8px font-family: monospace font-size: 14px overflow-x: auto width: 100% margin-bottom: 1.5rem (blank if not programming).
        Use the provided chapter details: ${JSON.stringify(chapter)}`;

      // ✅ Replaced Gemini .sendMessage() with new Groq function
      const aiResp = await generateNotes(PROMPT);

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
    const { studyType, prompt, recordId } = event.data;

    // 👇 Add this temporarily
    console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);
    console.log("studyType:", studyType);
    console.log("recordId:", recordId);

    const AiResult = await step.run('Generating content using AI', async () => {
      // ✅ Replaced Gemini .sendMessage() with new Groq functions
      if (studyType === 'flashcard') return await generateFlashCards(prompt);
      if (studyType === 'quiz') return await generateQuiz(prompt);
      return await generateQa(prompt);
    });

    await step.run('Save Result to DB', async () => {
      await db.update(STUDY_TYPE_CONTENT_TABLE).set({
        content: AiResult,
        status: 'Ready',
      }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
      return 'Data Inserted';
    });
  }
);