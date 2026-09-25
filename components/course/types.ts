export interface CourseDetail {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  level: string | null;
  domain: string | null;
}

export interface LessonItem {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  order_index: number;
  is_free: boolean;
}

export interface LessonProgressItem {
  lesson_id: string;
  progress_percentage: number;
  completed: boolean;
  last_position?: number;
}
