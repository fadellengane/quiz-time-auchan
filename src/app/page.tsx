import { prisma } from "@/lib/prisma";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import type { CurrentQuizResponse } from "@/types";
import { Frown } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * Point d'entrée du QR Code : `/`  ou  `/?store=nom-du-magasin`.
 * Le paramètre `store` prépare le multi-magasin : chaque magasin pourra
 * avoir son propre QR Code pointant vers `/?store=<slug>`.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeSlug } = await searchParams;

  const quiz = await prisma.quiz.findFirst({
    where: {
      isActive: true,
      ...(storeSlug ? { store: { slug: storeSlug } } : {}),
    },
    include: {
      questions: { orderBy: { order: "asc" }, take: 1 },
      store: true,
    },
    orderBy: { startDate: "desc" },
  });

  const question = quiz?.questions[0];

  if (!quiz || !question) {
    return <EmptyState />;
  }

  // Enregistre le scan sans bloquer le rendu (fire-and-forget).
  prisma.scan
    .create({ data: { quizId: quiz.id, storeId: quiz.storeId } })
    .catch(() => {});

  const initial: CurrentQuizResponse = {
    quizId: quiz.id,
    reward: quiz.reward,
    question: {
      id: question.id,
      label: question.label,
      choices: question.choices as { id: string; label: string }[],
    },
    store: {
      name: quiz.store?.name ?? "Auchan",
      googleReviewUrl: quiz.store?.googleReviewUrl ?? "https://www.google.com/maps",
    },
  };

  return <QuizFlow initial={initial} />;
}

function EmptyState() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-surface-soft px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Frown className="h-8 w-8 text-ink/30" />
      </div>
      <h1 className="text-xl font-semibold text-ink">Aucun quiz en cours</h1>
      <p className="max-w-xs text-sm text-ink/50">
        Revenez la semaine prochaine pour tenter votre chance !
      </p>
    </div>
  );
}
