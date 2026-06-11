"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  FALLBACK_EDUCATION_TOPICS,
  FALLBACK_QUIZ_QUESTIONS,
} from "@/lib/data/education";
import type { EducationTopicRow, QuizQuestionRow } from "@/types/database";

export function useEducationTopics() {
  const [topics, setTopics] = useState<EducationTopicRow[]>(
    FALLBACK_EDUCATION_TOPICS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("education_topics")
        .select("*")
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        setTopics(data);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { topics, loading };
}

export function useEducationTopic(slug: string) {
  const { topics, loading } = useEducationTopics();
  const topic = topics.find((t) => t.slug === slug) ?? null;
  return { topic, loading };
}

export function useQuizQuestions(topicSlug: string) {
  const [questions, setQuestions] = useState<QuizQuestionRow[]>(() =>
    FALLBACK_QUIZ_QUESTIONS.filter((q) => q.topic_slug === topicSlug).sort(
      (a, b) => a.sort_order - b.sort_order
    )
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("topic_slug", topicSlug)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        setQuestions(data);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [topicSlug]);

  return { questions, loading };
}
