"use client";

import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/PageHeader";
import { TopicCard } from "@/components/education/TopicCard";
import { useEducationTopics } from "@/lib/hooks/useEducation";

export default function EducationPage() {
  const { t } = useTranslation();
  const { topics, loading } = useEducationTopics();

  return (
    <div>
      <PageHeader title={t("education.title")} subtitle={t("education.subtitle")} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading && (
          <p className="lang-km text-center text-muted-foreground">
            {t("common.loading")}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
