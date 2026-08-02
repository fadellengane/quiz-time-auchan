import { QrCode, Users, CheckCircle2, TrendingUp, ExternalLink, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [scans, participations, correctAnswers, googleClicks, ratingAgg, activeQuiz] =
    await Promise.all([
      prisma.scan.count(),
      prisma.participation.count(),
      prisma.participation.count({ where: { isCorrect: true } }),
      prisma.participation.count({ where: { redirectedToGoogle: true } }),
      prisma.participation.aggregate({ _avg: { rating: true } }),
      prisma.quiz.findFirst({ where: { isActive: true }, include: { questions: true } }),
    ]);

  const conversionRate = scans > 0 ? Math.round((participations / scans) * 1000) / 10 : 0;
  const averageRating = ratingAgg._avg.rating ? Math.round(ratingAgg._avg.rating * 10) / 10 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Statistiques</h1>
        <p className="mt-1 text-sm text-ink/50">
          Vue d&apos;ensemble des performances du quiz en cours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Scans" value={scans} icon={QrCode} />
        <StatCard label="Participations" value={participations} icon={Users} accent />
        <StatCard label="Bonnes réponses" value={correctAnswers} icon={CheckCircle2} />
        <StatCard label="Taux de conversion" value={`${conversionRate}%`} icon={TrendingUp} />
        <StatCard label="Clics avis Google" value={googleClicks} icon={ExternalLink} />
        <StatCard label="Note moyenne" value={averageRating || "—"} icon={Star} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz actif</CardTitle>
        </CardHeader>
        <CardContent>
          {activeQuiz ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-ink">{activeQuiz.title}</p>
              <p className="text-sm text-ink/60">
                {activeQuiz.questions[0]?.label ?? "Aucune question associée"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-ink/50">
              Aucun quiz actif — créez la question de la semaine pour lancer le
              parcours client.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
