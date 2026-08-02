import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DrawWinner } from "@/components/admin/DrawWinner";
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDrawPage() {
  const activeQuiz = await prisma.quiz.findFirst({ where: { isActive: true } });

  const eligibleCount = activeQuiz
    ? await prisma.participation.count({
        where: { quizId: activeQuiz.id, isCorrect: true, isWinner: false },
      })
    : 0;

  const winners = await prisma.winner.findMany({
    orderBy: { drawnAt: "desc" },
    take: 10,
    include: { quiz: { select: { title: true } } },
  });

  const winnersWithParticipation = await Promise.all(
    winners.map(async (w: (typeof winners)[number]) => ({
      ...w,
      participation: await prisma.participation.findUnique({
        where: { id: w.participationId },
      }),
    }))
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Tirage au sort</h1>
        <p className="mt-1 text-sm text-ink/50">
          {eligibleCount} participant(s) éligible(s) pour le quiz en cours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DrawWinner hasEligible={eligibleCount > 0} />

        <Card>
          <CardHeader>
            <CardTitle>Historique des gagnants</CardTitle>
            <CardDescription>Les 10 derniers tirages.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {winnersWithParticipation.length === 0 && (
              <p className="text-sm text-ink/50">Aucun tirage effectué.</p>
            )}
            {winnersWithParticipation.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-2xl border border-border p-4"
              >
                <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {w.participation
                      ? `${w.participation.firstName} ${w.participation.lastName}`
                      : "—"}
                  </p>
                  <p className="text-xs text-ink/45">
                    {w.quiz.title} · {w.drawnAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
