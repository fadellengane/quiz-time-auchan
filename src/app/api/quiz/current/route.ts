import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CurrentQuizResponse } from "@/types";

export async function GET(req: NextRequest) {
  const storeSlug = req.nextUrl.searchParams.get("store") ?? undefined;

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
    return NextResponse.json({ error: "no_active_quiz" }, { status: 404 });
  }

  const payload: CurrentQuizResponse = {
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

  return NextResponse.json(payload);
}
