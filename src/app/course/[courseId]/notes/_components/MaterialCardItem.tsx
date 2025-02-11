import { Notes, result } from '@/app/_types/Types';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { Item } from '@radix-ui/react-select';
import axios from 'axios';
import { and, eq } from 'drizzle-orm';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface ContentType {
  name: string;
  desc: string;
  icon: string;
  path: string;
  type: string;
}

export interface PropType {
  item: ContentType;
  studyTypeContent: Notes;
  course: result;
  refreshData: () => Promise<void>;
  setNotesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notesLoading: boolean;
}

const MaterialCardItem = (props: PropType) => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (props.item.type === 'notes' && props.studyTypeContent?.notes.length < 3) {
      checkNotes();
    }
  }, [props.studyTypeContent?.notes.length, props.item.type]);

  const checkNotes = async () => {
    setLoading(true); // Ensure loading is true at the start
    const result = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(
        and(
          eq(CHAPTER_NOTES_TABLE.courseId, props.course.courseId),
          eq(CHAPTER_NOTES_TABLE.status, 'Ready')
        )
      );

    console.log("Chapters length: " + props.course.courseLayout.chapters.length);
    console.log("Result.Length: " + result.length);
    console.log(`Condition: ${result.length === props.course.courseLayout.chapters.length}`)
    if (result.length === props.course.courseLayout.chapters.length) {
      await props.refreshData();
      setLoading(false); // Set loading to false only after all checks are complete
    } else {
      setLoading(true)
      setTimeout(async () => {
        await props.refreshData();
        await checkNotes(); // Ensure recursive call happens
      }, 2000);
    }
  };


  const GenerateContent = async () => {
    setLoading(true);
    const chapters = props.course.courseLayout.chapters
      .map((chapter) => chapter.chapterTitle)
      .join(',');

    try {
      // Initiate content generation
      await axios.post('/api/study-type-content', {
        courseId: props.course.courseId,
        type: props.item.type,
        chapters,
      });

      const CheckStatus = async () => {
        const rows = await db
          .select()
          .from(STUDY_TYPE_CONTENT_TABLE)
          .where(
            and(
              eq(STUDY_TYPE_CONTENT_TABLE.courseId, props.course.courseId),
              eq(STUDY_TYPE_CONTENT_TABLE.status, 'Ready')
            )
          );

        const isContentReady = rows.length > 0;
        if (isContentReady) {
          await props.refreshData();
          setLoading(false);
          toast.success(`${props.item.type} Generated Successfully!`);
        }
        else {
          CheckStatus()
        }
      };

      CheckStatus();
    } catch (error) {
      console.error("Error generating content:", error);
      setLoading(false);
      toast.error("Failed to generate content. Please try again.");
    }
  };



  const checkResult = () => {
    if(props.item.type === 'notes' && props.studyTypeContent?.[props.item.type as keyof Notes]?.length < props.course.courseLayout.chapters.length){
      return true
    }
    else if(props.item.type !== 'notes' && props.studyTypeContent?.[props.item.type as keyof Notes]?.length === 0){
      return true
    }

  };

  return (
    props.studyTypeContent && (
      <div
        className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${checkResult() && 'grayscale'
          }`}
      >
        {checkResult() ? (
          <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">Generate</h2>
        ) : (
          <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">Ready</h2>
        )}

        <Image src={props.item.icon} alt={props.item.name} width={40} height={40} />
        <h2 className="font-medium text-base">{props.item.name}</h2>
        <p className="text-gray-400 text-[13px] text-center">{props.item.desc}</p>

        {checkResult() ? (
          <Button
            className="mt-3 w-full"
            variant="outline"
            onClick={loading ? undefined : GenerateContent}
          >
            {loading ? (
              <span className="flex gap-2 items-center">
                Generating <RefreshCcw className="animate-spin" />
              </span>
            ) : (
              'Generate'
            )}
          </Button>
        ) : (
          <Link href={`/course/${props.course.courseId}/${props.item.path}`}>
            <Button className="mt-3 w-full" variant="outline">
              View
            </Button>
          </Link>
        )}
      </div>
    )
  );
};

export default MaterialCardItem;
