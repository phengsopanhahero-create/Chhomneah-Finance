"use client";

import { useTranslation } from "react-i18next";
import { Send, MessageCircle } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";

export default function ChatbotPage() {
  const { t } = useTranslation();

  const telegramUrl = TELEGRAM_BOT_USERNAME
    ? `https://t.me/${TELEGRAM_BOT_USERNAME}`
    : null;

  return (
    <div>
      <PageHeader title={t("chatbot.title")} subtitle={t("chatbot.subtitle")} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Card className="border-2 border-secondary/40 text-center">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-8 w-8" />
            </span>
            {telegramUrl ? (
              <Button asChild size="lg" className="lang-km">
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                  <Send className="mr-2 h-4 w-4" />
                  {t("chatbot.open_telegram")}
                </a>
              </Button>
            ) : (
              <p className="lang-km text-sm text-muted-foreground">
                Telegram bot link not configured. Set
                NEXT_PUBLIC_TELEGRAM_BOT_USERNAME in your environment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="lang-km text-primary">
              {t("chatbot.how_it_works")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="lang-km list-inside list-decimal space-y-2 text-sm">
              <li>{t("chatbot.step1")}</li>
              <li>{t("chatbot.step2")}</li>
              <li>{t("chatbot.step3")}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="lang-km text-primary">
              {t("chatbot.sample_questions_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[t("chatbot.sample1"), t("chatbot.sample2"), t("chatbot.sample3")].map(
              (sample) => (
                <div
                  key={sample}
                  className="lang-km rounded-lg bg-muted px-4 py-3 text-sm font-medium"
                >
                  &ldquo;{sample}&rdquo;
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
