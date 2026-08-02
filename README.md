# 🎉 Quiz Time Auchan

Application web premium permettant aux clients Auchan de participer à un quiz
hebdomadaire (scan QR Code → question → coordonnées → avis) en moins de
30 secondes, avec un dashboard administrateur complet pour le community
manager.

## Stack technique

- **Next.js 15** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** — palette Auchan (rouge / blanc / gris clair)
- **Framer Motion** — transitions fluides entre étapes, sans rechargement
- **Composants UI façon shadcn/ui** (Radix primitives + CVA)
- **React Hook Form + Zod** — formulaires validés
- **Prisma + PostgreSQL**
- **Lucide Icons**

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# renseigner DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Générer le client Prisma + appliquer le schéma
npx prisma generate
npx prisma migrate dev --name init

# 4. Créer les données de démo (magasin, admin, quiz de la semaine)
npm run prisma:seed

# 5. Lancer le serveur de développement
npm run dev
```

- Parcours client : http://localhost:3000
- Dashboard admin : http://localhost:3000/admin/login
  (identifiants définis dans `.env` : `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Parcours utilisateur (< 30 secondes)

Une seule page (`src/app/page.tsx` + `QuizFlow.tsx`), aucune navigation,
aucun rechargement :

1. **Accueil** — titre, mise en avant du gain, CTA "Commencer"
2. **Question** — sélection d'une réponse → avancée automatique animée
3. **Coordonnées** — nom, prénom, téléphone, numéro de carte Auchan
   (React Hook Form + Zod)
4. **Satisfaction** — étoiles interactives
   - ⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐ → message de remerciement + bouton **Laisser un avis
     Google** (redirige vers la fiche Google du magasin)
   - ⭐⭐⭐ ou moins → message de remerciement simple, sans sollicitation Google

Chaque transition est gérée par Framer Motion (`AnimatePresence`), avec des
points de progression discrets en haut de la carte.

## Dashboard administrateur (`/admin`)

Protégé par authentification (email + mot de passe, session JWT en cookie
httpOnly). Permet de :

- **Statistiques** — scans, participations, bonnes réponses, taux de
  conversion, clics vers Google, note moyenne
- **Question de la semaine** — création/édition, choix de la bonne réponse ;
  publier une question active automatiquement le quiz correspondant
- **Participations** — recherche (nom, téléphone, carte), pagination,
  **export Excel** (.xlsx)
- **Tirage au sort** — sélection aléatoire automatique parmi les
  participants ayant donné la bonne réponse, historique des gagnants

> Sécurité : le `middleware.ts` fait une vérification rapide de présence du
> cookie de session (compatible Edge runtime) pour rediriger immédiatement
> les visiteurs non connectés ; la vérification cryptographique complète du
> JWT est effectuée côté serveur (`getAdminSession()`) dans le layout admin
> et dans chaque route API `/api/admin/*`, en runtime Node.js.

## Modèle de données (`prisma/schema.prisma`)

| Table            | Rôle                                                         |
| ---------------- | -------------------------------------------------------------- |
| `Store`          | Magasin (prépare le multi-magasin, QR codes par magasin)     |
| `User`           | Comptes administrateurs (community manager...)               |
| `Quiz`           | Une période de jeu (le "quiz de la semaine")                 |
| `Question`       | Question(s) rattachée(s) à un quiz, choix stockés en JSON     |
| `Participation`  | Un passage complet du parcours par un client                 |
| `Winner`         | Historique des tirages au sort                               |
| `Scan`           | Chaque chargement de la page (calcul du taux de conversion)  |

## Architecture pensée pour évoluer

Le code est volontairement modulaire pour ajouter, sans rupture :

- **Connexion au compte fidélité Auchan** — `ContactFormStep.tsx` reçoit
  uniquement `onSubmit`. Le champ `Participation.loyaltyAccountId` existe déjà
  en base ; il suffira d'ajouter un hook `useLoyaltyLookup()` qui pré-remplit
  (ou saute) l'étape formulaire dès qu'une API sera disponible.
- **Multi-magasin** — `Store` est déjà une entité indépendante ; chaque
  magasin peut avoir son propre QR Code pointant vers `/?store=<slug>`
  (déjà géré par `page.tsx` et `/api/quiz/current`).
- **Multi-quiz simultané** — `Quiz` est déjà rattaché à un `Store` avec une
  relation `1-N` vers `Question` ; il suffira de ne plus désactiver les
  autres quiz du magasin lors de la création d'une nouvelle question.
- **Dashboard multi-magasins** — les routes admin acceptent déjà un
  paramètre `storeId`/`quizId` optionnel à étendre.
- **Notifications** — le modèle `Winner` a un champ `notified` prêt à être
  branché sur un service d'envoi (email/SMS).

## Déploiement sur Vercel

1. Créer une base PostgreSQL managée (Vercel Postgres, Neon, Supabase...)
2. Renseigner les variables d'environnement du `.env.example` dans les
   paramètres du projet Vercel
3. Le script `build` (`prisma generate && next build`) génère
   automatiquement le client Prisma à chaque déploiement
4. Lancer `npx prisma migrate deploy` (via une CI ou manuellement) pour
   appliquer le schéma sur la base de production

## Structure du projet

```
src/
  app/
    page.tsx                 # Parcours client (une seule page)
    admin/                    # Dashboard (protégé)
    api/
      quiz/current/           # GET quiz actif
      participate/             # POST participation + tracking clic Google
      admin/                   # login, questions, participations, export, stats, tirage
  components/
    quiz/                     # Étapes du parcours client (Framer Motion)
    admin/                    # Composants du dashboard
    ui/                       # Primitives façon shadcn/ui
  lib/                        # prisma client, validations Zod, auth, constantes
  types/                      # Types partagés
prisma/
  schema.prisma
  seed.ts
```

## Notes

- Le numéro de carte Auchan et le téléphone sont validés côté client (Zod)
  et revalidés côté serveur avant tout enregistrement.
- Un participant ne peut pas resoumettre la même page sans repasser par
  l'étape "Commencer" ; une limite "un jeu par personne et par semaine" est
  à appliquer côté métier (ex: vérification du numéro de carte) selon les
  règles internes du magasin.
