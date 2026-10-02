import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface CommunityPaginationProps {
  totalPages: number;
  currentPage: number;
  locale: string;
  search: string;
  category: string;
  technology: string;
  sort: string;
}

/**
 * CommunityPagination renders numeric page links for browsing through community projects.
 */
export default function CommunityPagination({
  totalPages,
  currentPage,
  search,
  category,
  technology,
  sort,
}: CommunityPaginationProps) {
  const t = useTranslations("community");
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-12 flex justify-center items-center gap-2"
      aria-label={t("pagination")}
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
        const queryParams = new URLSearchParams({
          ...(search ? { q: search } : {}),
          ...(category ? { category } : {}),
          ...(technology ? { technology } : {}),
          ...(sort ? { sort } : {}),
          page: pageNum.toString(),
        }).toString();

        return (
          <Link
            key={pageNum}
            href={`/community?${queryParams}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              pageNum === currentPage
                ? "bg-brand text-black shadow-[0_0_15px_rgba(95,236,107,0.4)]"
                : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}
    </nav>
  );
}
