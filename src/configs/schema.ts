import { AIGeneratedNotesType } from "@/app/_types/NotesGenerateType";
import { flashCardAiResultType, QaResultType, QuizData, StudyMaterial } from "@/app/_types/Types";
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
    notes: json().$type<AIGeneratedNotesType>().notNull(),
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


// Generate detailed exam material content as a JSON, contains an object, and in it, generate 3 chapters object in an array as key value pair "chapters" and in each chapter, there should be one main heading as key value pair "heading" and paragraph for that heading as "headingPara" and after that there should be subheadings as key value pair "subheadings" and in it, there should be an array of objects containing  upto 6 subheading with its content in para (same as main heading) and add code according to the topic as a key value pair "codeBlock" in every subheading after "subheadingPara". Use these chapter details :

// Generate detailed content in JSON format. The output should contain an object with a key-value pair chapters, where the value is an array of 3 chapter objects. Each chapter should include the following structure:

// Generate detailed content in JSON format. The output should contain an object with a key-value pair chapters, where the value is an array of 3 chapter objects. Each chapter should include the following structure:
// A main heading as a key-value pair heading with its corresponding paragraph in headingPara.
// Subheadings as a key-value pair subheadings, which should be an array of objects. Each subheading object should include:
// A subheading as a key-value pair subheading.
// A corresponding paragraph for the subheading in subheadingPara.
// A key-value pair codeBlock, containing relevant code as a string based on the topic.
// Ensure the generated content remains consistent across multiple generations.
// Please use the following chapter details:

// {
//     "chapters": [
//       {
//         "heading": "TypeScript Fundamentals",
//         "headingPara": "This chapter introduces the fundamental concepts of TypeScript, a superset of JavaScript that adds static typing.  We'll cover setting up your development environment, understanding type annotations, and working with basic data types.  Learning these foundational elements is crucial for building robust and maintainable TypeScript applications.",
//         "subheadings": [
//           {
//             "subheading": "Setting up TypeScript Environment",
//             "subheadingPara": "Before diving into TypeScript code, you need to set up your development environment. This typically involves installing the TypeScript compiler (tsc) using npm or yarn.  After installation, you can create a tsconfig.json file to configure your project settings.",
//             "codeBlock": "npm install -g typescript\nnpm init -y\ntsc --init"
//           },
//           {
//             "subheading": "Basic Types",
//             "subheadingPara": "TypeScript offers several basic types to annotate variables. These include `number`, `string`, `boolean`, `null`, and `undefined`.  Type annotations improve code readability and help catch errors during development.",
//             "codeBlock": "let age: number = 30;\nlet name: string = \"John Doe\";\nlet isAdult: boolean = true;\nlet user: null = null;\nlet value: undefined = undefined;"
//           },
//           {
//             "subheading": "Arrays and Tuples",
//             "subheadingPara": "Arrays in TypeScript can be annotated with the type of their elements.  Tuples are a special type of array where the length and type of each element are fixed.",
//             "codeBlock": "let numbers: number[] = [1, 2, 3];\nlet stringArray: string[] = ['a', 'b', 'c'];\nlet tuple: [string, number] = ['hello', 5];"
//           }
//         ]
//       },
//       {
//         "heading": "Advanced Types and Generics",
//         "headingPara": "This chapter delves into more advanced TypeScript concepts, focusing on generics, type inference, and complex type combinations. Mastering these techniques is essential for building reusable and type-safe components.",
//         "subheadings": [
//           {
//             "subheading": "Understanding Type Inference",
//             "subheadingPara": "TypeScript's type inference system automatically infers types based on the context.  This reduces the need for explicit type annotations in many cases, making the code cleaner and more concise.",
//             "codeBlock": "let inferredNumber = 10; // TypeScript infers 'number' type\nlet inferredString = 'hello'; // TypeScript infers 'string' type"
//           },
//           {
//             "subheading": "Generics",
//             "subheadingPara": "Generics allow you to write reusable components that can work with different types without compromising type safety. They use type parameters to represent unknown types.",
//             "codeBlock": "function identity<T>(arg: T): T {\n  return arg;\n}\nlet myNumber: number = identity<number>(10);\nlet myString: string = identity<string>('hello');"
//           },
//           {
//             "subheading": "Union and Intersection Types",
//             "subheadingPara": "Union types allow a variable to hold values of multiple types, while intersection types combine multiple types into a single type that includes all members of the constituent types.",
//             "codeBlock": "let value: string | number = 10; // Union type\nvalue = 'hello';\ninterface Person { name: string; }\ninterface Address { street: string; }\nlet personAddress: Person & Address; // Intersection type"
//           }
//         ]
//       },
//       {
//         "heading": "Object-Oriented Programming (OOP) in TypeScript",
//         "headingPara": "This chapter explores object-oriented programming (OOP) principles within the context of TypeScript.  We'll cover classes, inheritance, access modifiers, and abstract classes, showing how OOP enhances code organization and maintainability.",
//         "subheadings": [
//           {
//             "subheading": "Classes and Objects",
//             "subheadingPara": "Classes are blueprints for creating objects.  They define properties and methods that objects of that class will have.",
//             "codeBlock": "class Person {\n  name: string;\nage: number;\n  constructor(name: string, age: number) {\n    this.name = name;\n    this.age = age;\n  }\n}"
//           },
//           {
//             "subheading": "Inheritance",
//             "subheadingPara": "Inheritance allows creating new classes (derived classes) based on existing classes (base classes).  Derived classes inherit properties and methods from their base classes.",
//             "codeBlock": "class Employee extends Person {\n  salary: number;\n  constructor(name: string, age: number, salary: number) {\n    super(name, age);\n    this.salary = salary;\n  }\n}"
//           },
//           {
//             "subheading": "Access Modifiers",
//             "subheadingPara": "Access modifiers (`public`, `private`, `protected`) control the accessibility of class members from other parts of the code.",
//             "codeBlock": "class Person {\n  public name: string;\n  private age: number;\n  protected address: string;\n}"
//           }
//         ]
//       }
//     ]
//   }










