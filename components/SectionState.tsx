import type { ReactNode } from "react";
import SectionEmptyState from "@/components/SectionEmptyState";
import SectionErrorState from "@/components/SectionErrorState";
import SectionSkeleton from "@/components/SectionSkeleton";

interface Props {
  isLoading?: boolean;
  error?: Error | string | boolean | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  emptyActionHref?: string;
  emptyIcon?: ReactNode;
  skeletonVariant?: "course" | "series" | "continue";
  skeletonCount?: number;
  onRetry?: () => void;
  children: ReactNode;
}

export default function SectionState({
  isLoading = false,
  error,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  emptyActionText,
  emptyActionHref,
  emptyIcon,
  skeletonVariant = "course",
  skeletonCount = 4,
  onRetry,
  children,
}: Props) {
  if (isLoading) {
    return <SectionSkeleton variant={skeletonVariant} count={skeletonCount} />;
  }

  if (error) {
    const errorMsg =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : undefined;

    return <SectionErrorState description={errorMsg} onRetry={onRetry} />;
  }

  if (isEmpty) {
    if (!emptyTitle || !emptyDescription) {
      return null;
    }

    return (
      <SectionEmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionHref={emptyActionHref}
        icon={emptyIcon}
      />
    );
  }

  return <>{children}</>;
}
