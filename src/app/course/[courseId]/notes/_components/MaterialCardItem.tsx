'use client';
import { Notes, result } from '@/app/_types/Types';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
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

  // Use useCallback to prevent unnecessary re-renders of the polling logic
  const checkNotesStatus = useCallback(async () => {
    const result = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(
        and(
          eq(CHAPTER_NOTES_TABLE.courseId, props.course.courseId),
          eq(CHAPTER_NOTES_TABLE.status, 'Ready')
        )
      );

    if (result.length === props.course.courseLayout.chapters.length) {
      await props.refreshData();
      setLoading(false);
    } else {
      // Logic: Safe polling every 2 seconds
      setTimeout(() => checkNotesStatus(), 2000);
    }
  }, [props.course.courseId, props.course.courseLayout.chapters.length, props.refreshData]);

  useEffect(() => {
    const currentNotesLength = props.studyTypeContent?.notes?.length || 0;
    if (props.item.type === 'notes' && currentNotesLength < props.course.courseLayout.chapters.length) {
      setLoading(true);
      checkNotesStatus();
    }
  }, [props.studyTypeContent?.notes?.length, props.item.type, props.course.courseLayout.chapters.length, checkNotesStatus]);

  const GenerateContent = async () => {
    setLoading(true);
    const chapters = props.course.courseLayout.chapters
      .map((chapter) => chapter.chapterTitle)
      .join(',');

    try {
      // 1. Native Fetch replaces Axios
      const response = await fetch('/api/study-type-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: props.course.courseId,
          type: props.item.type,
          chapters,
        }),
      });

      if (!response.ok) throw new Error('Generation failed to start');

      // 2. Safe recursive polling with setTimeout
      const pollForContent = async () => {
        const rows = await db
          .select()
          .from(STUDY_TYPE_CONTENT_TABLE)
          .where(
            and(
              eq(STUDY_TYPE_CONTENT_TABLE.courseId, props.course.courseId),
              eq(STUDY_TYPE_CONTENT_TABLE.status, 'Ready'),
              eq(STUDY_TYPE_CONTENT_TABLE.type, props.item.type) // Explicitly check type
            )
          );

        if (rows.length > 0) {
          await props.refreshData();
          setLoading(false);
          toast.success(`${props.item.name} ready!`);
        } else {
          setTimeout(pollForContent, 3000); // Check every 3 seconds
        }
      };

      pollForContent();
    } catch (error) {
      console.error("Generation Error:", error);
      setLoading(false);
      toast.error("Generation failed.");
    }
  };

  const isMissingContent = () => {
    const type = props.item.type as keyof Notes;
    const content = props.studyTypeContent?.[type];
    
    if (props.item.type === 'notes') {
      return (content?.length || 0) < props.course.courseLayout.chapters.length;
    }
    return (content?.length || 0) === 0;
  };

  return (
    <div
      className={`border shadow-sm rounded-xl p-5 flex flex-col items-center transition-all ${
        isMissingContent() ? 'grayscale bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="w-full flex justify-end">
        <h2 className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          isMissingContent() ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'
        }`}>
          {isMissingContent() ? 'Generate' : 'Ready'}
        </h2>
      </div>

      <div className="my-3">
        <Image src={props.item.icon} alt={props.item.name} width={40} height={40} />
      </div>

      <h2 className="font-bold text-lg">{props.item.name}</h2>
      <p className="text-gray-400 text-[12px] text-center mb-4">{props.item.desc}</p>

      {isMissingContent() ? (
        <Button
          className="mt-auto w-full"
          variant="secondary"
          onClick={loading ? undefined : GenerateContent}
          disabled={loading}
        >
          {loading ? (
            <span className="flex gap-2 items-center">
              Generating <RefreshCcw className="animate-spin h-4 w-4" />
            </span>
          ) : (
            'Generate'
          )}
        </Button>
      ) : (
        <Link href={`/course/${props.course.courseId}/${props.item.path}`} className="w-full mt-auto">
          <Button className="w-full" variant="outline">
            View
          </Button>
        </Link>
      )}
    </div>
  );
};

export default MaterialCardItem;