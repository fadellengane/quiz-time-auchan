import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ParticipationsTable } from "@/components/admin/ParticipationsTable";

export default function AdminParticipationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Participations</h1>
        <p className="mt-1 text-sm text-ink/50">
          Recherchez un participant et exportez la liste complète.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les participations</CardTitle>
          <CardDescription>25 résultats par page.</CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipationsTable />
        </CardContent>
      </Card>
    </div>
  );
}
