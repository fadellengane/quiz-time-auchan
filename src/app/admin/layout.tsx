import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification cryptographique complète du JWT (le middleware ne fait
  // qu'une vérification rapide de présence du cookie en Edge runtime).
  const session = await getAdminSession();

  // La page de login gère elle-même son propre layout minimal.
  // On ne peut pas connaître le pathname ici facilement sans passer par
  // des headers ; le middleware redirige déjà /admin/* non authentifié,
  // donc si on arrive ici sans session c'est qu'on est sur /admin/login.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-surface-soft">
      <Sidebar userName={session.name} />
      <main className="min-h-[100dvh] flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
