import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { 
  CreateNewUser, 
  GenerateNotes, 
  GenerateSingleChapterNotes, // 👈 missing
  GenerateStudyTypeContent, 
  helloWorld 
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming: 'allow',
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateSingleChapterNotes, // 👈 missing
    GenerateStudyTypeContent,
  ],
});