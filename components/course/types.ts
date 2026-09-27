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

export type SubmissionStatus = "submitted" | "late" | "graded";

export interface AssignmentItem {
  id: string;
  lesson_id: string;
  title: string;
  instructions: string | null;
  max_score: number;
  due_date: string | null;
  is_published: boolean;
  created_at: string;
}

export interface AssignmentSubmissionItem {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  submitted_at: string;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
}
