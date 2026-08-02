import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const quizId = req.nextUrl.searchParams.get("quizId") ?? undefined;

  const winners = await prisma.winner.findMany({
    where: quizId ? { quizId } : undefined,
    orderBy: { drawnAt: "desc" },
    include: {
      quiz: { select: { title: true } },
    },
  });

  const withParticipation = await Promise.all(
    winners.map(async (w: (typeof winners)[number]) => ({
      ...w,
      participation: await prisma.participation.findUnique({
        where: { id: w.participationId },
      }),
    }))
  );

  return NextResponse.json(withParticipation);
}

/** Tirage au sort automatique parmi les bonnes réponses non déjà gagnantes. */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const quizId: string | undefined = body?.quizId;

  const targetQuiz = quizId
    ? await prisma.quiz.findUnique({ where: { id: quizId } })
    : await prisma.quiz.findFirst({ where: { isActive: true } });

  if (!targetQuiz) {
    return NextResponse.json({ error: "quiz_not_found" }, { status: 404 });
  }

  const eligible = await prisma.participation.findMany({
    where: { quizId: targetQuiz.id, isCorrect: true, isWinner: false },
  });

  if (eligible.length === 0) {
    return NextResponse.json({ error: "no_eligible_participants" }, { status: 400 });
  }

  const chosen = eligible[Math.floor(Math.random() * eligible.length)];

  const [winner] = await prisma.$transaction([
    prisma.winner.create({
      data: { quizId: targetQuiz.id, participationId: chosen.id },
    }),
    prisma.participation.update({
      where: { id: chosen.id },
      data: { isWinner: true },
    }),
  ]);

  return NextResponse.json({ winner, participation: chosen });
}
