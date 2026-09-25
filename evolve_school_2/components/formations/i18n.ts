// Small local dictionary so we avoid repeating locale ? : chains everywhere.
type Locale = "ar" | "en" | "fr";

const dict = {
  completed: { ar: "مكتمل 🎓", en: "Completed 🎓", fr: "Complétée 🎓" },
  courses: { ar: "دورات", en: "courses", fr: "cours" },
  fullTrack: { ar: "مسار كامل", en: "Full track", fr: "Parcours complet" },
  trackProgress: {
    ar: "تقدم المسار",
    en: "Track progress",
    fr: "Progression du parcours",
  },
  completedModules: {
    ar: "وحدات مكتملة",
    en: "completed modules",
    fr: "modules validés",
  },
  continue: { ar: "متابعة", en: "Continue", fr: "Continuer" },
  start: { ar: "بدء", en: "Start", fr: "Commencer" },
  curriculumTitle: {
    ar: "برنامج المسار",
    en: "Track curriculum",
    fr: "Programme du parcours",
  },
  curriculumSubtitle: {
    ar: "اتبع الدورات بالترتيب الموصى به للحصول على الشهادة",
    en: "Follow the courses in recommended order to earn your certification",
    fr: "Suivez les cours dans l'ordre recommandé pour valider votre certification",
  },
  modules: { ar: "وحدات", en: "Modules", fr: "Modules" },
  locked: { ar: "مغلق", en: "Locked", fr: "Verrouillé" },
  review: { ar: "مراجعة ✓", en: "Review ✓", fr: "Revoir ✓" },
  continueArrow: { ar: "متابعة ←", en: "Continue →", fr: "Continuer →" },
  startArrow: { ar: "بدء ←", en: "Start →", fr: "Commencer →" },
  defaultModuleDesc: {
    ar: "وحدة تعليمية عملية.",
    en: "Hands-on learning module.",
    fr: "Module d'apprentissage pratique.",
  },
} as const;

// Lookup helper: t("continue", locale)
export function t(key: keyof typeof dict, locale: string): string {
  const entry = dict[key];
  return entry[(locale as Locale) in entry ? (locale as Locale) : "fr"];
}
