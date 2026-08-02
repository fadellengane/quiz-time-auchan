import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { questionSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const quizzes = await prisma.quiz.findMany({
    include: { questions: true, store: true, _count: { select: { participations: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(quizzes);
}

/**
 * Crée la question de la semaine : on crée un nouveau Quiz actif (et on
 * désactive les précédents pour ne garder qu'un seul quiz "en direct"),
 * avec sa question associée. Prépare naturellement le multi-quiz simultané :
 * il suffira de ne plus désactiver les autres quiz du même magasin.
 */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { label, choices, correctChoiceId } = parsed.data;
  const store = await prisma.store.findFirst({ where: { isActive: true } });

  const quiz = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.quiz.updateMany({ data: { isActive: false }, where: { isActive: true } });
    return tx.quiz.create({
      data: {
        title: `Quiz du ${new Date().toLocaleDateString("fr-FR")}`,
        isActive: true,
        storeId: store?.id,
        questions: {
          create: [{ label, choices, correctChoiceId, order: 0 }],
        },
      },
      include: { questions: true },
    });
  });

  return NextResponse.json(quiz, { status: 201 });
}
