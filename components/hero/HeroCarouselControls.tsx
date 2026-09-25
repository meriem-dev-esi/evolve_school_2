import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroCourse } from "./types";

interface HeroCarouselControlsProps {
  courses: HeroCourse[];
  active: number;
  setActive: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * HeroCarouselControls provides slide indicator dots and previous/next arrows.
 */
export default function HeroCarouselControls({
  courses,
  active,
  setActive,
  onPrev,
  onNext,
}: HeroCarouselControlsProps) {
  if (courses.length <= 1) return null;

  return (
    <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-6">
      {/* Indicators */}
      <div className="flex items-center gap-2.5">
        {courses.map((course, index) => (
          <button
            key={course.id}
            type="button"
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === active
                ? "w-10 bg-white shadow-sm"
                : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
