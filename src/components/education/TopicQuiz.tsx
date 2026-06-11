"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizQuestionRow } from "@/types/database";

export function TopicQuiz({ questions }: { questions: QuizQuestionRow[] }) {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (questions.length === 0) return null;

  const question = questions[currentIndex];
  const options = isKhmer ? question.options_km : question.options_en;
  const questionText = isKhmer ? question.question_km : question.question_en;
  const isLast = currentIndex === questions.length - 1;
  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correct_index;

  function handleSelect(index: number) {
    if (hasAnswered) return;
    setSelectedOption(index);
    if (index === question.correct_index) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      setCompleted(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setCompleted(false);
  }

  if (completed) {
    return (
      <Card className="border-2 border-secondary/50">
        <CardHeader>
          <CardTitle className="lang-km text-center text-primary">
            {t("education.quiz_complete")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="lang-km text-lg">
            {t("education.quiz_score")}:{" "}
            <span className="text-2xl font-extrabold text-primary">
              {score} / {questions.length}
            </span>
          </p>
          <Button onClick={handleRetry} variant="secondary" className="lang-km">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("education.quiz_retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-secondary/50">
      <CardHeader>
        <CardTitle className="lang-km flex items-center justify-between text-primary">
          <span>{t("education.quiz_title")}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="lang-km text-base font-semibold">{questionText}</p>

        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            const showCorrect = hasAnswered && index === question.correct_index;
            const showIncorrect = hasAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                disabled={hasAnswered}
                className={cn(
                  "lang-km flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
                  !hasAnswered && "border-border hover:border-primary hover:bg-primary/5",
                  showCorrect && "border-green-500 bg-green-50 text-green-800",
                  showIncorrect && "border-destructive bg-red-50 text-destructive",
                  hasAnswered && !showCorrect && !showIncorrect && "border-border opacity-60"
                )}
              >
                <span>{option}</span>
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {showIncorrect && <XCircle className="h-5 w-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="space-y-3">
            <p
              className={cn(
                "lang-km text-sm font-semibold",
                isCorrect ? "text-green-700" : "text-destructive"
              )}
            >
              {isCorrect ? t("education.quiz_correct") : t("education.quiz_incorrect")}
            </p>
            <Button onClick={handleNext} className="lang-km w-full">
              {isLast ? t("education.quiz_complete") : t("education.quiz_next")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
