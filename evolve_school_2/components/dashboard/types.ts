export interface EnrolledCourseItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  domain?: string | null;
  level?: string | null;
  duration?: string | null;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  isCompleted: boolean;
  nextLesson?: {
    id: string;
    title: string;
    order_index: number;
  } | null;
}

export interface WorkshopItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  duration: string | null;
  level: string | null;
  domain: string | null;
  price: number;
}

export interface UserStats {
  totalCourses: number;
  inProgressCount: number;
  completedCount: number;
  totalLessonsCompleted: number;
  totalHoursEstimated: number;
  streakDays: number;
  certificatesEarned: number;
}

export type DashboardTab = "all" | "in_progress" | "completed" | "workshops";
