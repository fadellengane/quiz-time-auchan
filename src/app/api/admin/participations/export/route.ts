import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const participations = await prisma.participation.findMany({
    orderBy: { createdAt: "desc" },
    include: { question: true },
  });

  const rows = participations.map((p: (typeof participations)[number]) => ({
    Date: p.createdAt.toLocaleString("fr-FR"),
    Prénom: p.firstName,
    Nom: p.lastName,
    Téléphone: p.phone,
    "Carte Auchan": p.cardNumber,
    Question: p.question.label,
    "Réponse donnée": p.selectedChoiceId,
    "Bonne réponse ?": p.isCorrect ? "Oui" : "Non",
    Note: p.rating,
    "Avis Google cliqué ?": p.redirectedToGoogle ? "Oui" : "Non",
    Gagnant: p.isWinner ? "Oui" : "Non",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participations");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="participations-${Date.now()}.xlsx"`,
    },
  });
}
