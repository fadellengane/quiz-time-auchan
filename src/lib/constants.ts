/**
 * Constantes du parcours utilisateur.
 * Centraliser ces valeurs facilite l'ajout futur du multi-magasin / multi-quiz :
 * il suffira de les faire dépendre d'un `storeId` récupéré depuis l'URL du QR Code.
 */
export const QUIZ_STEPS = {
  WELCOME: "welcome",
  QUESTION: "question",
  CONTACT: "contact",
  RATING: "rating",
  DONE: "done",
} as const;

export type QuizStep = (typeof QUIZ_STEPS)[keyof typeof QUIZ_STEPS];

export const STEP_ORDER: QuizStep[] = [
  QUIZ_STEPS.WELCOME,
  QUIZ_STEPS.QUESTION,
  QUIZ_STEPS.CONTACT,
  QUIZ_STEPS.RATING,
  QUIZ_STEPS.DONE,
];

export const BRAND = {
  name: "Quiz Time Auchan",
  reward: "10 € crédités sur votre carte Auchan",
};
