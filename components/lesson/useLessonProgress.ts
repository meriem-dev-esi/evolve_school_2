import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getYouTubeId, type YouTubePlayer } from "./youtube";

interface UseLessonProgressOptions {
  lessonId: string;
  youtubeUrl: string;
  courseId: string;
  nextCourseId?: string | null;
  isLastCourse?: boolean;
  formationId?: string | null;
  locale: string;
}

/**
 * Custom hook to initialize YouTube player and track video playback progress in Supabase.
 * Handles automatic completion marking and redirection to next lesson / formation completion.
 */
export function useLessonProgress({
  lessonId,
  youtubeUrl,
  courseId,
  nextCourseId,
  isLastCourse,
  formationId,
  locale,
}: UseLessonProgressOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    const videoId = getYouTubeId(youtubeUrl);
    if (!videoId || !containerRef.current) return;

    let interval: number | null = null;
    let cancelled = false;
    const supabase = createClient();

    const startPlayer = async () => {
      if (!window.YT || !containerRef.current || cancelled) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      let lastPosition = 0;
      if (user) {
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("last_position")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .maybeSingle();

        lastPosition = progress?.last_position ?? 0;
      }

      new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          start: lastPosition,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;

            if (lastPosition > 0) {
              event.target.seekTo(lastPosition, true);
            }

            interval = window.setInterval(async () => {
              if (!playerRef.current || !user || cancelled) return;

              const currentTime = playerRef.current.getCurrentTime();
              const duration = playerRef.current.getDuration();
              if (!duration) return;

              const percentage = Math.min(
                100,
                Math.round((currentTime / duration) * 100),
              );
              const completed = percentage >= 95;

              const { error } = await supabase.from("lesson_progress").upsert(
                {
                  user_id: user.id,
                  lesson_id: lessonId,
                  progress_percentage: completed ? 100 : percentage,
                  completed,
                  last_position: Math.floor(currentTime),
                  updated_at: new Date().toISOString(),
                },
                {
                  onConflict: "user_id,lesson_id",
                },
              );

              if (error) {
                console.error("[Evolve] Progress save error:", error);
                return;
              }

              // Check if entire course is completed
              if (completed && !redirectedRef.current) {
                const { data: courseLessons } = await supabase
                  .from("lessons")
                  .select("id")
                  .eq("course_id", courseId);

                if (courseLessons && courseLessons.length > 0) {
                  const lessonIds = courseLessons.map((l) => l.id);
                  const { data: completedLessons } = await supabase
                    .from("lesson_progress")
                    .select("lesson_id")
                    .eq("user_id", user.id)
                    .eq("completed", true)
                    .in("lesson_id", lessonIds);

                  const allCompleted =
                    completedLessons?.length === courseLessons.length;
                  if (!allCompleted) return;

                  redirectedRef.current = true;

                  if (isLastCourse) {
                    const completionUrl = formationId
                      ? `/${locale}/formations?completed=1&formation=${formationId}`
                      : `/${locale}/formations?completed=1`;
                    window.location.href = completionUrl;
                    return;
                  }

                  if (nextCourseId) {
                    const { data: nextLessons } = await supabase
                      .from("lessons")
                      .select("id, order_index")
                      .eq("course_id", nextCourseId)
                      .order("order_index", { ascending: true });

                    const firstNextLesson = nextLessons?.[0];
                    if (firstNextLesson) {
                      window.location.href = `/${locale}/courses/${nextCourseId}/lessons/${firstNextLesson.id}`;
                      return;
                    }

                    window.location.href = `/${locale}/courses/${nextCourseId}`;
                    return;
                  }

                  window.location.href = `/${locale}/formations`;
                  return;
                }
              }
            }, 10000);
          },
        },
      });
    };

    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        void startPlayer();
      };

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    } else {
      void startPlayer();
    }

    return () => {
      cancelled = true;
      if (interval !== null) {
        window.clearInterval(interval);
      }
      playerRef.current = null;
    };
  }, [
    lessonId,
    youtubeUrl,
    courseId,
    nextCourseId,
    isLastCourse,
    formationId,
    locale,
  ]);

  return { containerRef };
}
