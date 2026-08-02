import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const store = await prisma.store.findFirst({ where: { isActive: true } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Paramètres</h1>
        <p className="mt-1 text-sm text-ink/50">
          Gérez les informations de votre magasin.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Avis Google</CardTitle>
          <CardDescription>
            Ce lien est utilisé pour rediriger vos clients satisfaits vers
            votre fiche Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {store ? (
            <StoreSettingsForm
              storeName={store.name}
              initialGoogleReviewUrl={store.googleReviewUrl}
            />
          ) : (
            <p className="text-sm text-ink/50">
              Aucun magasin actif trouvé. Contactez votre administrateur.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
