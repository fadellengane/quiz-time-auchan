import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { participationSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = participationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    quizId,
    questionId,
    selectedChoiceId,
    rating,
    firstName,
    lastName,
    phone,
    cardNumber,
    storeSlug,
  } = parsed.data;

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.quizId !== quizId) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }

  const store = storeSlug
    ? await prisma.store.findUnique({ where: { slug: storeSlug } })
    : null;

  const participation = await prisma.participation.create({
    data: {
      quizId,
      questionId,
      storeId: store?.id,
      firstName,
      lastName,
      phone,
      cardNumber,
      selectedChoiceId,
      isCorrect: selectedChoiceId === question.correctChoiceId,
      rating,
    },
  });

  return NextResponse.json({ id: participation.id, isCorrect: participation.isCorrect });
}
