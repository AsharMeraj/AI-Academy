import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const MODEL_NAME = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = "You are a professional educational AI. You must output raw, valid JSON only. Do not wrap the output in ```json markdown blocks. Return only the JSON object or array.";

/**
 * 1. Generate Course Outline
 */
export async function generateCourseOutline(topicPrompt: string) {
  try {
    const { text } = await generateText({
      model: groq(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: "Generate a study material for Python for Exam and level of difficulty will be beginner with summary of course, List of chapters (Max 3) along with summary and Emoji icon for each chapter, Topic list for each chapter. All result in JSON format"
        },
        {
          role: 'assistant',
          content: `{"courseSummary": "This introductory Python course covers the fundamental concepts...", "chapters": [{"chapterTitle": "Introduction to Python and Basic Syntax", "emoji": "🐍", "chapterSummary": "This chapter introduces the basics...", "topics": ["Installing Python", "Variables"]}]}`
        },
        {
          role: 'user',
          content: topicPrompt
        }
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("Course Outline Generation Error:", error);
    throw new Error("Failed to generate course outline.");
  }
}

/**
 * 2. Generate Notes
 */
export async function generateNotes(topicPrompt: string) {
  try {
    const { text } = await generateText({
      model: groq(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate detailed content in JSON format in one line in non readable format, The output should contain an object with a key-value pair chapters, where the chapter is an object. The chapter should include:
            heading: Main heading of the chapter with given emoji at the end.
            headingPara: A paragraph explaining the chapter's topic.
            subheadings: An array of 4 objects, each with:
            subheading: Title of the subheading.
            subheadingPara: A short paragraph (up to 1 line if the chapter is about programming, otherwise up to 3 lines).
            codeBlock: Complete HTML code with proper spaces not in one line, in all subheadings (if the chapter is about programming, otherwise make it blank), styled with: background-color: #f3f4f6 padding: 1.5rem border-radius: 8px font-family: monospace font-size: 14px overflow-x: auto width: 100% margin-bottom: 1.5rem
            Use the provided chapter details:
            {"chapterTitle": "Advanced Build Tools and Testing", "emoji": "⚙️", "chapterSummary": "This chapter dives into advanced techniques for building and testing TypeScript projects.", "topics": ["Advanced TypeScript Compiler Options", "Webpack Configuration", "Module Resolution Strategies", "Advanced Testing Techniques"]}`
        },
        {
          role: 'assistant',
          content: `{"chapters": {"heading": "Advanced Build Tools and Testing ⚙️", "headingPara": "This chapter delves into advanced techniques for building and testing TypeScript projects. We will explore different build processes, focusing on efficient workflows and robust testing strategies.", "subheadings": [{"subheading": "Advanced TypeScript Compiler Options", "subheadingPara": "Explore advanced TypeScript compiler options to fine-tune your build process and enhance code quality.", "codeBlock": "<pre style=\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\"><code>{\\n  \\"compilerOptions\\": {\\n    \\"target\\": \\"es5\\",\\n    \\"strict\\": true\\n  }\\n}</code></pre>"}, {"subheading": "Webpack Configuration for TypeScript", "subheadingPara": "Learn how to configure Webpack to effectively bundle and optimize your TypeScript projects.", "codeBlock": "<pre style=\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\"><code>module.exports = {\\n  module: {\\n    rules: [{\\n      test: /\\.tsx?$/,\\n      use: 'ts-loader'\\n    }]\\n  }\\n};</code></pre>"}, {"subheading": "Module Resolution Strategies", "subheadingPara": "Understand different module resolution strategies in TypeScript for better project organization.", "codeBlock": "<pre style=\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\"><code>\\"baseUrl\\": \\"./src\\",\\n\\"paths\\": { \\"@modules/*\\": [\\"modules/*\\"] }</code></pre>"}, {"subheading": "Advanced Testing Techniques", "subheadingPara": "Master unit, integration, and end-to-end testing using frameworks like Jest, Mocha, and Cypress.", "codeBlock": "<pre style=\\"background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; width: 100%; margin-bottom: 1.5rem;\\"><code>describe('myFunction', () => {\\n  it('should return correct value', () => {\\n    expect(myFunction(1)).toBe(2);\\n  });\\n});</code></pre>"}]}}`
        },
        {
          role: 'user',
          content: topicPrompt
        }
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("Notes Generation Error:", error);
    throw new Error("Failed to generate notes.");
  }
}

/**
 * 3. Generate Flashcards
 */
export async function generateFlashCards(topicPrompt: string) {
  try {
    const { text } = await generateText({
      model: groq(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: "Generate the flashcards on topic : Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with front back content Maximum 15"
        },
        {
          role: 'assistant',
          content: `[{"front": "What is Flutter?", "back": "Flutter is Google's UI toolkit..."}, {"front": "What is a Widget in Flutter?", "back": "Everything in Flutter is a widget..."}]`
        },
        {
          role: 'user',
          content: topicPrompt
        }
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    throw new Error("Failed to generate flashcards.");
  }
}

/**
 * 4. Generate Quiz
 */
export async function generateQuiz(topicPrompt: string) {
  try {
    const { text } = await generateText({
      model: groq(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: "Generate Quiz on topic: Flutter Fundamentals... with Question and one word options along with correct answer in JSON format, (Max 10)"
        },
        {
          role: 'assistant',
          content: `{"quiz": [{"question": "The primary programming language used in Flutter development?", "options": ["Java", "Kotlin", "Dart", "Swift"], "answer": "Dart"}]}`
        },
        {
          role: 'user',
          content: topicPrompt
        }
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz.");
  }
}

/**
 * 5. Generate Q&A
 */
export async function generateQa(topicPrompt: string) {
  try {
    const { text } = await generateText({
      model: groq(MODEL_NAME),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: "Generate Question answers on topic: Flutter fundamentals, Basic app navigation, UI interface Development. The result should have an array of objects with \"question\" and \"answer\" field as key value pair in each object. All the result in JSON format, (Max 10)"
        },
        {
          role: 'assistant',
          content: `[{"question": "What is Flutter?", "answer": "Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase."}, {"question": "What are Widgets in Flutter?", "answer": "Widgets are the fundamental building blocks of Flutter UIs. Everything you see on the screen is a widget."}]`
        },
        {
          role: 'user',
          content: topicPrompt
        }
      ],
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("Q&A Generation Error:", error);
    throw new Error("Failed to generate Q&A.");
  }
}