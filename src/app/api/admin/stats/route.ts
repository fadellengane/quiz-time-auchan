import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { StatsResponse } from "@/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [scans, participations, correctAnswers, googleClicks, ratingAgg] =
    await Promise.all([
      prisma.scan.count(),
      prisma.participation.count(),
      prisma.participation.count({ where: { isCorrect: true } }),
      prisma.participation.count({ where: { redirectedToGoogle: true } }),
      prisma.participation.aggregate({ _avg: { rating: true } }),
    ]);

  const payload: StatsResponse = {
    scans,
    participations,
    correctAnswers,
    conversionRate: scans > 0 ? Math.round((participations / scans) * 1000) / 10 : 0,
    googleClicks,
    averageRating: ratingAgg._avg.rating ? Math.round(ratingAgg._avg.rating * 10) / 10 : 0,
  };

  return NextResponse.json(payload);
}
