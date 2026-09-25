export type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  duration: string | null;
  level: string | null;
  domain: string | null;
  progress: number;
  completed: boolean;
  nextLessonId: string | null;
};

export type Formation = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  level: string | null;
  domain: string | null;
  courses: Course[];
};

export const FORMATION_CATEGORIES = [
  "Business & Product",
  "Cloud & DevOps",
  "Data & AI",
  "Digital Marketing",
  "Mobile Development",
  "Web Development",
  "Career Skills",
  "Cybersecurity",
  "Design",
];
