/**
 * Script de seed - crée un magasin, un admin, et le quiz de la semaine.
 * Usage : npm run prisma:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: process.env.DEFAULT_STORE_SLUG ?? "auchan-demo" },
    update: {},
    create: {
      name: "Auchan Démo",
      slug: process.env.DEFAULT_STORE_SLUG ?? "auchan-demo",
      city: "Paris",
      googleReviewUrl:
        "https://g.page/r/CZfT4rlnMZKlEAE/review",
    },
  });

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "admin1234",
    10
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@auchan.fr" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@auchan.fr",
      passwordHash,
      name: "Community Manager",
      role: "SUPER_ADMIN",
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: "Quiz de la semaine",
      isActive: true,
      storeId: store.id,
      reward: "10€ crédités sur votre carte Auchan",
      questions: {
        create: [
          {
            label:
              "Combien est cagnotté tous les jours sur des centaines de produits Auchan ?",
            choices: [
              { id: "a", label: "2 %" },
              { id: "b", label: "5 %" },
              { id: "c", label: "10 %" },
            ],
            correctChoiceId: "b",
            order: 0,
          },
        ],
      },
    },
  });

  console.log("Seed terminé :", { store: store.slug, quiz: quiz.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
