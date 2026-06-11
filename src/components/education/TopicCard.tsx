"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Percent,
  AlertTriangle,
  PiggyBank,
  Smartphone,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EducationTopicRow } from "@/types/database";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Percent,
  AlertTriangle,
  PiggyBank,
  Smartphone,
};

export function TopicCard({ topic }: { topic: EducationTopicRow }) {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";

  const Icon = (topic.icon && ICON_MAP[topic.icon]) || BookOpen;

  const title = isKhmer ? topic.title_km : topic.title_en;
  const summary = isKhmer ? topic.summary_km : topic.summary_en;

  return (
    <Link href={`/education/${topic.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="lang-km">{title}</CardTitle>
          <CardDescription className="lang-km">{summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="lang-km inline-flex items-center text-sm font-semibold text-primary">
            {t("education.read_more")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
