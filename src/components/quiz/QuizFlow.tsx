"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { ProgressDots } from "@/components/quiz/ProgressDots";
import { WelcomeStep } from "@/components/quiz/WelcomeStep";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { ContactFormStep } from "@/components/quiz/ContactFormStep";
import { RatingStep } from "@/components/quiz/RatingStep";
import { QUIZ_STEPS, type QuizStep } from "@/lib/constants";
import type { ContactFormValues } from "@/lib/validations";
import type { CurrentQuizResponse } from "@/types";

/**
 * Orchestre tout le parcours client sur une seule page (aucune navigation,
 * aucun rechargement). Chaque étape est un composant contrôlé, animé avec
 * Framer Motion. L'état est gardé ici pour rester simple à faire évoluer
 * (ex: brancher plus tard un état global / une connexion compte fidélité).
 */
export function QuizFlow({ initial }: { initial: CurrentQuizResponse }) {
  const [step, setStep] = useState<QuizStep>(QUIZ_STEPS.WELCOME);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactFormValues | null>(null);
  const [participationId, setParticipationId] = useState<string | null>(null);

  const handleAnswer = useCallback((choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setStep(QUIZ_STEPS.CONTACT);
  }, []);

  const handleContact = useCallback((values: ContactFormValues) => {
    setContact(values);
    setStep(QUIZ_STEPS.RATING);
  }, []);

  const handleRate = useCallback(
    async (rating: number) => {
      if (!selectedChoiceId || !contact) return;
      try {
        const res = await fetch("/api/participate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: initial.quizId,
            questionId: initial.question.id,
            selectedChoiceId,
            rating,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
            cardNumber: contact.cardNumber,
          }),
        });
        if (!res.ok) throw new Error("submit_failed");
        const data = await res.json();
        setParticipationId(data.id);
      } catch {
        toast.error("Un souci est survenu, mais votre participation reste prise en compte.");
      }
    },
    [selectedChoiceId, contact, initial.quizId, initial.question.id]
  );

  const handleGoogleClick = useCallback(() => {
    if (!participationId) return;
    fetch(`/api/participate/${participationId}/google-click`, { method: "POST" }).catch(
      () => {}
    );
  }, [participationId]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-surface-soft px-4 py-10">
      <div className="mb-6 w-full max-w-md">
        <ProgressDots current={step} />
      </div>

      <Card className="w-full max-w-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === QUIZ_STEPS.WELCOME && (
              <WelcomeStep
                key="welcome"
                reward={initial.reward}
                storeName={initial.store.name}
                onStart={() => setStep(QUIZ_STEPS.QUESTION)}
              />
            )}
            {step === QUIZ_STEPS.QUESTION && (
              <QuestionStep key="question" question={initial.question} onAnswer={handleAnswer} />
            )}
            {step === QUIZ_STEPS.CONTACT && (
              <ContactFormStep key="contact" onSubmit={handleContact} />
            )}
            {step === QUIZ_STEPS.RATING && (
              <RatingStep
                key="rating"
                googleReviewUrl={initial.store.googleReviewUrl}
                onRate={handleRate}
                onGoogleClick={handleGoogleClick}
              />
            )}
          </AnimatePresence>
        </div>
      </Card>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-xs text-ink/35"
      >
        Un jeu par personne et par semaine. Voir conditions en magasin.
      </motion.p>
    </div>
  );
}
