import { z } from "zod";

/**
 * Schéma du formulaire de contact (étape 3).
 * Le numéro de carte Auchan Auchan comporte généralement 13 à 19 chiffres
 * selon les cartes ; on reste volontairement permissif (10 à 20 chiffres)
 * pour ne pas bloquer un client de bonne foi.
 */
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Prénom trop court")
    .max(50, "Prénom trop long"),
  lastName: z
    .string()
    .trim()
    .min(2, "Nom trop court")
    .max(50, "Nom trop long"),
  phone: z
    .string()
    .trim()
    .regex(/^0[1-9](\s?\d{2}){4}$/, "Numéro de téléphone invalide (ex: 06 12 34 56 78)"),
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{10,20}$/, "Numéro de carte Auchan invalide"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Paramètres du magasin modifiables depuis le dashboard admin.
 * On accepte soit une URL Google classique, soit un lien court g.page.
 */
export const storeSettingsSchema = z.object({
  googleReviewUrl: z
    .string()
    .trim()
    .url("Ce n'est pas une URL valide")
    .refine(
      (url) => url.includes("google.com") || url.includes("g.page"),
      "Le lien doit pointer vers Google (google.com ou g.page)"
    ),
});

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

/** Payload complet envoyé à l'API lors de la soumission finale. */
export const participationSchema = z.object({
  quizId: z.string(),
  questionId: z.string(),
  selectedChoiceId: z.string(),
  rating: z.number().int().min(1).max(5),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  cardNumber: z.string().min(1),
  storeSlug: z.string().optional(),
});

export type ParticipationInput = z.infer<typeof participationSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const questionSchema = z.object({
  label: z.string().min(5, "La question est trop courte"),
  choices: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Réponse vide"),
      })
    )
    .min(2, "Au moins 2 réponses")
    .max(6, "6 réponses maximum"),
  correctChoiceId: z.string().min(1, "Sélectionnez la bonne réponse"),
});
