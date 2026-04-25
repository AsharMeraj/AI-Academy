import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { 
  CreateNewUser, 
  GenerateNotes, 
  GenerateSingleChapterNotes,
  GenerateStudyTypeContent, 
  helloWorld 
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming: true, // 👈 was 'allow', now boolean
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateSingleChapterNotes,
    GenerateStudyTypeContent,
  ],
});