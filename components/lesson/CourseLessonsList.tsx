import { Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface LessonListItem {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  order_index: number;
  is_free: boolean;
}

interface CourseLessonsListProps {
  lessons: LessonListItem[];
  courseId: string;
  currentLessonId: string;
  isEnrolled: boolean;
}

export default function CourseLessonsList({
  lessons,
  courseId,
  currentLessonId,
  isEnrolled,
}: CourseLessonsListProps) {
  return (
    <div className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">Leçons du cours</h2>

      <div className="flex flex-col gap-4">
        {lessons.map((l) => {
          const unlocked = l.is_free || isEnrolled;
          const isCurrent = l.id === currentLessonId;

          return (
            <div
              key={l.id}
              className={`flex items-center justify-between rounded-2xl border p-5 ${
                isCurrent ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    unlocked
                      ? "bg-muted text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {unlocked ? l.order_index + 1 : <Lock className="h-4 w-4" />}
                </div>

                <div>
                  <p className="font-semibold">{l.title}</p>
                  {l.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {l.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span
                      className={unlocked ? "font-medium text-foreground" : ""}
                    >
                      {unlocked ? "Gratuit" : "Formation Complète"}
                    </span>
                    {l.duration != null && <span>{l.duration} min</span>}
                  </div>
                </div>
              </div>

              {unlocked ? (
                <Link
                  href={`/courses/${courseId}/lessons/${l.id}`}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                >
                  {isCurrent ? "En cours" : "Commencer"}
                </Link>
              ) : (
                <Link
                  href={`/courses/${courseId}`}
                  className="flex items-center gap-1 rounded-full border px-5 py-2 text-sm font-semibold text-muted-foreground"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Débloquer
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
