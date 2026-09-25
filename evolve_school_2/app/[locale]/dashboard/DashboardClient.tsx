"use client";

import { useState } from "react";
import DashboardCertificateModal from "@/components/dashboard/DashboardCertificateModal";
import DashboardCommunitySection from "@/components/dashboard/DashboardCommunitySection";
import DashboardCoursesGrid from "@/components/dashboard/DashboardCoursesGrid";
import DashboardFilterTabs from "@/components/dashboard/DashboardFilterTabs";
import DashboardHeroBanner from "@/components/dashboard/DashboardHeroBanner";
import DashboardRecommendationsSection from "@/components/dashboard/DashboardRecommendationsSection";
import DashboardResumeBanner from "@/components/dashboard/DashboardResumeBanner";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import DashboardWorkshopsSection from "@/components/dashboard/DashboardWorkshopsSection";
import type {
  DashboardTab,
  EnrolledCourseItem,
  UserStats,
  WorkshopItem,
} from "@/components/dashboard/types";

// Re-export types for backward compatibility across consumers
export type { DashboardTab, EnrolledCourseItem, UserStats, WorkshopItem };

interface DashboardClientProps {
  locale: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  userRole?: string | null;
  stats: UserStats;
  enrolledCourses: EnrolledCourseItem[];
  recommendedCourses: EnrolledCourseItem[];
  upcomingWorkshops: WorkshopItem[];
}

/**
 * DashboardClient orchestrates the student learning portal:
 * metrics, active courses, workshops, recommendations, and certificate views.
 */
export default function DashboardClient({
  locale,
  userName,
  userEmail,
  userAvatar,
  userRole,
  stats,
  enrolledCourses,
  recommendedCourses,
  upcomingWorkshops,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [certificateCourse, setCertificateCourse] =
    useState<EnrolledCourseItem | null>(null);

  // Filter courses based on tab and live search input
  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "in_progress") {
      return !course.isCompleted;
    }
    if (activeTab === "completed") {
      return course.isCompleted;
    }
    return true;
  });

  // Find the top priority course to resume
  const resumeCourse =
    enrolledCourses.find((c) => !c.isCompleted && c.nextLesson) ||
    enrolledCourses[0];

  return (
    <div className="space-y-10">
      {/* 1. Student Hero Welcome Banner */}
      <DashboardHeroBanner
        locale={locale}
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        userRole={userRole}
        resumeCourse={resumeCourse}
      />

      {/* 2. Gamified Metrics Strip */}
      <DashboardStatsGrid stats={stats} />

      {/* 3. Spotlight: Last Active Lesson Resume Banner */}
      {resumeCourse && (
        <DashboardResumeBanner
          locale={locale}
          resumeCourse={resumeCourse}
          onOpenCertificate={setCertificateCourse}
        />
      )}

      {/* 4. Controls: Tabs & Search Filter */}
      <DashboardFilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCoursesCount={enrolledCourses.length}
        inProgressCount={stats.inProgressCount}
        completedCount={stats.completedCount}
        workshopsCount={upcomingWorkshops.length}
      />

      {/* 5. Courses Content Area / Workshops Tab */}
      {activeTab !== "workshops" ? (
        <DashboardCoursesGrid
          locale={locale}
          filteredCourses={filteredCourses}
          totalCoursesCount={enrolledCourses.length}
          onOpenCertificate={setCertificateCourse}
        />
      ) : (
        <DashboardWorkshopsSection
          locale={locale}
          upcomingWorkshops={upcomingWorkshops}
        />
      )}

      {/* 6. Recommended Courses */}
      <DashboardRecommendationsSection
        locale={locale}
        recommendedCourses={recommendedCourses}
      />

      {/* 7. Quick Access to Mentors & Community */}
      <DashboardCommunitySection locale={locale} />

      {/* 8. Certificate Modal */}
      {certificateCourse && (
        <DashboardCertificateModal
          course={certificateCourse}
          userName={userName}
          onClose={() => setCertificateCourse(null)}
        />
      )}
    </div>
  );
}
