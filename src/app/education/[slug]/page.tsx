"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BookOpen } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopicQuiz } from "@/components/education/TopicQuiz";
import {
  useEducationTopic,
  useQuizQuestions,
} from "@/lib/hooks/useEducation";

export default function EducationTopicPage() {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { topic, loading } = useEducationTopic(slug);
  const { questions } = useQuizQuestions(slug);

  const [showQuiz, setShowQuiz] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="lang-km text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="lang-km text-muted-foreground">{t("common.error")}</p>
        <Link href="/education" className="lang-km mt-4 inline-block text-primary underline">
          {t("education.back_to_topics")}
        </Link>
      </div>
    );
  }

  const title = isKhmer ? topic.title_km : topic.title_en;
  const content = isKhmer ? topic.content_km : topic.content_en;

  return (
    <div>
      <PageHeader title={title} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link
          href="/education"
          className="lang-km inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("education.back_to_topics")}
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="lang-km whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {content}
            </p>
          </CardContent>
        </Card>

        {questions.length > 0 && !showQuiz && (
          <div className="text-center">
            <Button onClick={() => setShowQuiz(true)} size="lg" className="lang-km">
              {t("education.take_quiz")}
            </Button>
          </div>
        )}

        {showQuiz && questions.length > 0 && <TopicQuiz questions={questions} />}
      </div>
    </div>
  );
}
