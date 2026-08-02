import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { storeSettingsSchema } from "@/lib/validations";

/**
 * Renvoie le magasin actif (aujourd'hui unique, mais prêt pour le
 * multi-magasin : il suffira de filtrer par storeId lié à l'admin connecté).
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const store = await prisma.store.findFirst({ where: { isActive: true } });
  if (!store) return NextResponse.json({ error: "no_store" }, { status: 404 });

  return NextResponse.json(store);
}

/**
 * Met à jour les paramètres du magasin actif (pour l'instant : le lien
 * d'avis Google). Le lien est celui utilisé par la page de notation
 * (étape "RatingStep") pour rediriger les clients satisfaits.
 */
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = storeSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const store = await prisma.store.findFirst({ where: { isActive: true } });
  if (!store) return NextResponse.json({ error: "no_store" }, { status: 404 });

  const updated = await prisma.store.update({
    where: { id: store.id },
    data: { googleReviewUrl: parsed.data.googleReviewUrl },
  });

  return NextResponse.json(updated);
}
