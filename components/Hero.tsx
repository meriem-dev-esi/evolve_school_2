"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import EarthGlobe from "@/components/EarthGlobe";
import HeroCarouselControls from "@/components/hero/HeroCarouselControls";
import HeroContent from "@/components/hero/HeroContent";
import type { HeroCourse } from "@/components/hero/types";
import { createClient } from "@/lib/supabase/client";

export default function Hero() {
  const [courses, setCourses] = useState<HeroCourse[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locale = useLocale();

  // Load featured published courses
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { data, error } = await supabase
          .from("courses")
          .select(
            "id, title, description, image_url, price, duration, level, type",
          )
          .eq("is_published", true)
          .limit(5);

        if (error) {
          console.error("Error loading courses:", error);
          setError(error.message);
          return;
        }

        setCourses((data ?? []) as HeroCourse[]);
      } catch (err) {
        console.error("Unexpected error loading courses:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load courses.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCourses();
  }, []);

  // Auto carousel cycling
  useEffect(() => {
    if (courses.length <= 1) return;

    const interval = setInterval(() => {
      setActive((current) => (current + 1) % courses.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [courses.length]);

  // Carousel controls
  const handlePrev = () => {
    if (courses.length === 0) return;
    setActive((current) => (current === 0 ? courses.length - 1 : current - 1));
  };

  const handleNext = () => {
    if (courses.length === 0) return;
    setActive((current) => (current + 1) % courses.length);
  };

  // Loading spinner state
  if (loading) {
    return (
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-transparent text-white">
        <div className="absolute inset-0 bg-radial-hero opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-white/20" />
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-white" />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/50">
            Chargement des formations d&apos;élite...
          </p>
        </div>
      </section>
    );
  }

  // Error fallback state
  if (error) {
    return (
      <section className="relative flex min-h-[90vh] items-center justify-center bg-transparent px-6 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-400">
            !
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">
            Impossible de charger les formations
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/50">
            Une erreur réseau est survenue. Veuillez rafraîchir la page.
          </p>
        </div>
      </section>
    );
  }

  // Active or fallback course
  const activeCourse: HeroCourse = courses[active] ?? {
    id: "default-course",
    title: "Maîtrisez les Compétences du Futur",
    description:
      "Formations d'élite en UI/UX Design, Développement Web Fullstack et Technologies Créatives conçues pour le marché algérien et international.",
    image_url: null,
    price: 15000,
    duration: "8 Semaines",
    level: "Tous Niveaux",
    type: "FORMATION DIPLÔMANTE",
  };

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden bg-transparent pb-14 pt-24 text-white">
      {/* Background grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Main container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Active Course presentation */}
          <HeroContent course={activeCourse} locale={locale} />

          {/* Right Column: 3D Interactive Globe */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative h-[420px] w-full sm:h-[500px]">
              <EarthGlobe />
            </div>
          </div>
        </div>

        {/* Carousel slide navigation */}
        <HeroCarouselControls
          courses={courses}
          active={active}
          setActive={setActive}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </section>
  );
}
