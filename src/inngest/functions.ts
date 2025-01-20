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

// export const GenerateNotes = inngest.createFunction(
//   { id: 'generate-notes' },
//   { event: 'notes.generate' },
//   async ({ event, step }) => {
//     const { course }: { course: result } = event.data;

//     // Generate Notes with each chapter using AI
//     const Chapters = course.courseLayout.chapters;
//     await step.run('Generate Chapter Notes', async () => {
//       Chapters.map(async (chap, index) => {
//         try {
//           const PROMPT = `
//             Generate detailed exam material content as a JSON array of objects containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
//           Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
//           Subheadings: Include up to 4 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
//           Paragraphs: Add paragraphs in every subheading styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
//           Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
//           Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
//           Don't add any invalid control characters, bad escape sequences, or unnecessary whitespace that might cause errors in string literals.
//           Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chap)}
//           `;
//           const result = await generateNotesAiModel.sendMessage(PROMPT);
//           const aiResp = JSON.parse(result.response.text());

//           await db.insert(CHAPTER_NOTES_TABLE).values({
//             chapterId: index,
//             courseId: course.courseId,
//             notes: aiResp,
//             status: 'Ready',
//           });
//         } catch (error) {
//           console.error(`Error generating notes for chapter ${index}:`, error);
//           return null; // Skip this chapter on error
//         }
//       });
//     });
//   }
// );



//     await step.run('Generate Chapter Notes', async () => {
//       const chapterPromises = Chapters.map(async (chap, index) => {
//         try {
//           const PROMPT = `
//             Generate detailed exam material content as a JSON array of objects containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
//           Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
//           Subheadings: Include up to 6 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
//           Paragraphs: Add paragraphs in every subheading styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
//           Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
//           Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
//           Don't add any invalid control characters, bad escape sequences, or unnecessary whitespace that might cause errors in string literals.
//           Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chap)}
//           `;
//           const result = await generateNotesAiModel.sendMessage(PROMPT);
//           const aiResp = JSON.parse(result.response.text());

//           return {
//             chapterId: index,
//             courseId: course.courseId,
//             notes: aiResp,
//             status: 'Ready',
//           };
//         } catch (error) {
//           console.error(`Error generating notes for chapter ${index}:`, error);
//           return null; // Skip this chapter on error
//         }
//       });

//       const chapterData = (await Promise.all(chapterPromises))
//         .filter((data) => data !== null) as {
//           chapterId: number;
//           courseId: string;
//           notes: NotesChapter[];
//           status: string;
//         }[];
//       console.log(chapterData)
//       if (chapterData.length) {
//         await db.insert(CHAPTER_NOTES_TABLE).values(chapterData);
//       }
//     });
//   }
// );

// Generate detailed exam material content as a JSON array of objects containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
//           Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
//           Subheadings: Include up to 6 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
//           Paragraphs: Add paragraphs in every subheading styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
//           Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
//           Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
//           Don't add any invalid control characters, bad escape sequences, or unnecessary whitespace that might cause errors in string literals.
//           Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chap)}
//           `;

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-notes' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course }: { course: result } = event.data;

    // Generate Notes with each chapter using AI
    const Chapters = course.courseLayout.chapters;

    await step.run('Generate Chapter Notes', async () => {
      for (const [index, chap] of Chapters.entries()) {
        try {
          const PROMPT = `
            Generate detailed exam material content as a JSON array of objects containing a single "content" key with its value as an HTML string styled using inline CSS. Follow these guidelines:
          Main Headings: Style with font-size: 2rem; font-weight: bold; color: black; margin-bottom: 0.5rem;.
          Subheadings: Include up to 4 subheadings, styled with color: #007bff; font-weight: bold; font-size: 1.7rem; margin-bottom: 0;.
          Paragraphs: Add paragraphs in every subheading styled with font-size: 16px; line-height: 1.6; margin-bottom: 0; padding: 0.5rem;.
          Programming Topics: Add responsive code blocks under each subheading, styled with background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;.
          Mobile-Friendly Layout: Maintain a clean design with margin-top: 1.5rem; margin-bottom: 1.5rem; between sections.
          Don't add any invalid control characters, bad escape sequences, or unnecessary whitespace that might cause errors in string literals.
          Exclude <html>, <head>, <body>, and <title> tags. Use the provided chapter details to generate the content: ${JSON.stringify(chap)}
          `;

          const result = await generateNotesAiModel.sendMessage(PROMPT);
          const aiResp = JSON.parse(result.response.text());

          // Insert generated notes into the database
          await db.insert(CHAPTER_NOTES_TABLE).values({
            chapterId: index,
            courseId: course.courseId,
            notes: aiResp,
            status: 'Ready',
          });

          console.log(`Successfully generated notes for chapter ${index}`);
        } catch (error) {
          console.error(`Error generating notes for chapter ${index}:`, error);
        }
      }
    });
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
