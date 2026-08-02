import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionEditor } from "@/components/admin/QuestionEditor";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const quizzes = await prisma.quiz.findMany({
    include: { questions: true, _count: { select: { participations: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Question de la semaine
        </h1>
        <p className="mt-1 text-sm text-ink/50">
          Publier une nouvelle question active immédiatement le quiz et
          désactive le précédent.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle question</CardTitle>
            <CardDescription>
              Choisissez la bonne réponse en cliquant sur le rond à gauche.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionEditor />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique</CardTitle>
            <CardDescription>Les 10 derniers quiz créés.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {quizzes.length === 0 && (
              <p className="text-sm text-ink/50">Aucun quiz pour l&apos;instant.</p>
            )}
            {quizzes.map((quiz: (typeof quizzes)[number]) => (
              <div
                key={quiz.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border p-4"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {quiz.questions[0]?.label ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    {quiz._count.participations} participation(s) ·{" "}
                    {quiz.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                {quiz.isActive && <Badge>Actif</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
