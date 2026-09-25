import { CheckCircle2, Clock, Lock, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { LessonItem, LessonProgressItem } from "./types";

interface CourseLessonsListProps {
  courseId: string;
  lessonList: LessonItem[];
  progressList: LessonProgressItem[];
  isPaid: boolean;
}

/**
 * CourseLessonsList renders the curriculum module list with lock states,
 * completion checkmarks, lesson durations, and start/continue CTAs.
 */
export default function CourseLessonsList({
  courseId,
  lessonList,
  progressList,
  isPaid,
}: CourseLessonsListProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            Programme des Leçons
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Accédez aux cours vidéo, exercices pratiques et quiz
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
          {lessonList.length} modules
        </span>
      </div>

      <div className="space-y-3.5">
        {lessonList.map((lesson, index) => {
          const lessonProgress = progressList.find(
            (item) => item.lesson_id === lesson.id,
          );

          const completed = lessonProgress?.completed ?? false;
          const percentage = lessonProgress?.progress_percentage ?? 0;
          const accessible = lesson.is_free || isPaid;

          return (
            <div
              key={lesson.id}
              className={`glass-card rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:border-brand/30 ${
                !accessible ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  {/* Number or Checkmark */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${
                      completed
                        ? "bg-brand/20 text-brand border border-brand/30"
                        : accessible
                          ? "bg-white/10 text-white border border-white/15"
                          : "bg-white/5 text-white/30 border border-white/5"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : accessible ? (
                      index + 1
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {lesson.title}
                    </h3>

                    {lesson.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-white/50">
                        {lesson.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-white/50">
                      <span>
                        {lesson.is_free ? (
                          <span className="text-brand font-semibold">
                            Gratuit
                          </span>
                        ) : (
                          "Formation Complète"
                        )}
                      </span>

                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-sky-400" />
                          {lesson.duration} min
                        </span>
                      )}

                      {percentage > 0 && !completed && (
                        <span className="text-brand font-semibold">
                          {percentage}% visionné
                        </span>
                      )}

                      {completed && (
                        <span className="text-brand font-bold">Complété ✓</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div>
                  {accessible ? (
                    <Link
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                        completed
                          ? "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                          : "bg-brand text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(95,236,107,0.4)]"
                      }`}
                    >
                      <span>
                        {completed
                          ? "Revoir"
                          : percentage > 0
                            ? "Reprendre"
                            : "Commencer"}
                      </span>
                      <Play className="h-3 w-3 fill-current ms-0.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${courseId}/checkout`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-bold text-brand transition-all hover:bg-brand hover:text-black"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Débloquer</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mini Lesson Progress Bar */}
              {percentage > 0 && !completed && (
                <div className="mt-3.5 pt-3 border-t border-white/5">
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
