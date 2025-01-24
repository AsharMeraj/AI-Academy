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
// const PROMPT = `
//   You are an expert notes generator, Generate detailed exam material content as a JSON array of objects containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
//   Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
//   Subheadings: Include up to 4 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
//   Paragraphs: Add paragraphs in every subheading styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
//   Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
//   Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
//   Don't add any invalid control characters, bad escape sequences, or unnecessary whitespace that might cause errors in string literals.
//   Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chapter)}
// `;
export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course }: { course: result } = event.data;

    // Extract chapters from the course layout
    const Chapters = course.courseLayout.chapters;

    // Log the chapters for debugging
    console.log("Chapters to generate notes for:", Chapters);
    await step.run('Generate Chapter Notes', async () => {
      for (const [index, chapter] of Chapters.entries()) {
        try {
          const PROMPT =
            //   `Generate detailed content in JSON format. The output should contain an object with a key-value pair chapters, where the chapter is an object. chapter should include the following structure:
            // A main heading as a key-value pair heading with its corresponding paragraph in headingPara.
            // 4 Subheadings as a key-value pair subheadings, which should be an array of objects. Each subheading object should include:
            // A subheading as a key-value pair subheading.
            // A corresponding paragraph for the subheading in subheadingPara.
            // A key-value pair codeBlock, containing relevant code as a string based on the topic.
            // A code block should be complete html as string styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; overflow-x: auto; width: 100%; margin-bottom: 1.5rem, ensure horizontal scroll bar for responsiveness and clean and readable code with font-size: 14px
            // Ensure the generated content remains consistent across multiple generations.
            // Please use the following chapter details: ${JSON.stringify(chapter)}`
            `Generate detailed content in JSON format. The output should contain an object with a key-value pair chapters, where the chapter is an object. The chapter should include:
            heading: Main heading of the chapter with given emoji an the end.
            headingPara: A paragraph explaining the chapter's topic.
            subheadings: An array of 4 objects, each with:
            subheading: Title of the subheading.
            subheadingPara: Paragraph explaining the subheading with in 2 lines.
            codeBlock: Relevant code in complete HTML styled with the following CSS (make sure it is readable and complete code related to it): background-color: #f3f4f6 padding: 1.5rem border-radius: 8px font-family: monospace font-size: 14px overflow-x: auto for horizontal scrolling width: 100% margin-bottom: 1.5rem
            Ensure clean, consistent, and engaging content. Use the provided chapter details: ${JSON.stringify(chapter)}.`

          // Call the AI model to generate notes
          const result = await generateNotesAiModel.sendMessage(PROMPT);

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
      }
    });
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
