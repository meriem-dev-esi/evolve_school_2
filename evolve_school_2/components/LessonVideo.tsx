"use client";

import { useLessonProgress } from "./lesson/useLessonProgress";

interface LessonVideoProps {
  lessonId: string;
  youtubeUrl: string;
  courseId: string;
  nextCourseId?: string | null;
  isLastCourse?: boolean;
  formationId?: string | null;
  locale: string;
}

/**
 * LessonVideo embeds the YouTube player for a course lesson,
 * syncs video playback position, and handles automatic course progression.
 */
export default function LessonVideo({
  lessonId,
  youtubeUrl,
  courseId,
  nextCourseId,
  isLastCourse,
  formationId,
  locale,
}: LessonVideoProps) {
  const { containerRef } = useLessonProgress({
    lessonId,
    youtubeUrl,
    courseId,
    nextCourseId,
    isLastCourse,
    formationId,
    locale,
  });

  return (
    <div
      ref={containerRef}
      className="mt-10 aspect-video overflow-hidden rounded-3xl bg-black"
    />
  );
}
