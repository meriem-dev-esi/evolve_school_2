import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import ContinueLearningCard from "@/components/ContinueLearningCard";
import HorizontalCourseSection from "@/components/HorizontalCourseSection";
import SectionEmptyState from "@/components/SectionEmptyState";
import SectionErrorState from "@/components/SectionErrorState";
import type { ContinueLearning } from "@/lib/data/dashboard";

interface Props {
  user: unknown;
  locale: string;
  continueLearning: ContinueLearning | null;
  error?: Error | null;
}

export default function ContinueLearningSection({
  user,
  locale,
  continueLearning,
  error,
}: Props) {
  const tHome = useTranslations("home");

  if (error) {
    return (
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-white md:text-2xl">
            {tHome("continueLearning")}
          </h2>
          <SectionErrorState description={error.message} />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <HorizontalCourseSection
        title={tHome("continueLearning")}
        courses={[]}
        locale={locale}
        locked={true}
      />
    );
  }

  if (!continueLearning) {
    return (
      <section className="w-full px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <Clock className="h-5 w-5 text-brand" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {tHome("continueLearning")}
            </h2>
          </div>
          <SectionEmptyState
            title={tHome("emptyStates.continueLearning.title")}
            description={tHome("emptyStates.continueLearning.description")}
            actionText={tHome("emptyStates.continueLearning.action")}
            actionHref="/formations"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <Clock className="h-5 w-5 text-brand" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            {tHome("continueLearning")}
          </h2>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4">
          <ContinueLearningCard
            data={continueLearning}
            labels={{
              inProgress: tHome("inProgress"),
              progress: tHome("progress"),
              continueButton: tHome("continueButton"),
            }}
          />
        </div>
      </div>
    </section>
  );
}
