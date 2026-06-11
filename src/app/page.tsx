"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Calculator,
  MapPin,
  GraduationCap,
  MessageCircleMore,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      href: "/loans",
      icon: Calculator,
      title: t("home.feature_loans_title"),
      desc: t("home.feature_loans_desc"),
    },
    {
      href: "/finder",
      icon: MapPin,
      title: t("home.feature_finder_title"),
      desc: t("home.feature_finder_desc"),
    },
    {
      href: "/education",
      icon: GraduationCap,
      title: t("home.feature_education_title"),
      desc: t("home.feature_education_desc"),
    },
    {
      href: "/chatbot",
      icon: MessageCircleMore,
      title: t("home.feature_chatbot_title"),
      desc: t("home.feature_chatbot_desc"),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/20 to-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:py-16">
          <h1 className="lang-km max-w-3xl text-3xl font-extrabold leading-snug text-primary sm:text-4xl">
            {t("home.hero_title")}
          </h1>
          <p className="lang-km max-w-2xl text-base text-foreground/80 sm:text-lg">
            {t("home.hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/loans" className="lang-km">
                {t("home.cta_loans")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/finder" className="lang-km">
                {t("home.cta_finder")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/education" className="lang-km">
                {t("home.cta_education")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="lang-km">{feature.title}</CardTitle>
                  <CardDescription className="lang-km">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-semibold text-primary">
                    {t("loans.view_details")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
