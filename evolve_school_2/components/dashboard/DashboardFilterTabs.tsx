"use client";

import { Search } from "lucide-react";
import type { DashboardTab } from "./types";

interface DashboardFilterTabsProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCoursesCount: number;
  inProgressCount: number;
  completedCount: number;
  workshopsCount: number;
}

/**
 * DashboardFilterTabs provides categorized filtering (All, In Progress, Completed, Workshops)
 * and an interactive live search input.
 */
export default function DashboardFilterTabs({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  totalCoursesCount,
  inProgressCount,
  completedCount,
  workshopsCount,
}: DashboardFilterTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "all"
              ? "bg-lime-400 text-black shadow-md shadow-lime-400/30 font-bold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          Toutes mes formations ({totalCoursesCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("in_progress")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "in_progress"
              ? "bg-lime-400 text-black shadow-md shadow-lime-400/30 font-bold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          En cours ({inProgressCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "completed"
              ? "bg-lime-400 text-black shadow-md shadow-lime-400/30 font-bold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          Terminées ({completedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("workshops")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === "workshops"
              ? "bg-lime-400 text-black shadow-md shadow-lime-400/30 font-bold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          Ateliers &amp; Masterclasses ({workshopsCount})
        </button>
      </div>

      {/* Search input with logical start positioning */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrer mes cours..."
          className="w-full rounded-xl border border-gray-200 bg-white ps-10 pe-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 focus:outline-none shadow-sm"
        />
      </div>
    </div>
  );
}
