"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types";

export function QuestionStep({
  question,
  onAnswer,
}: {
  question: QuizQuestion;
  onAnswer: (choiceId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(choiceId: string) {
    if (selected) return; // évite le double-clic pendant la transition
    setSelected(choiceId);
    // Petite pause pour que l'utilisateur voie sa sélection avant l'avancée automatique.
    setTimeout(() => onAnswer(choiceId), 420);
  }

  return (
    <motion.div
      key="question"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-auchan-red-light">
          <HelpCircle className="h-5 w-5 text-auchan-red" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-semibold leading-snug text-ink sm:text-2xl">
          {question.label}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice, i) => {
          const isSelected = selected === choice.id;
          return (
            <motion.button
              key={choice.id}
              type="button"
              onClick={() => handleSelect(choice.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              disabled={!!selected}
              className={cn(
                "group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-base font-medium transition-all duration-200",
                isSelected
                  ? "border-auchan-red bg-auchan-red-light text-auchan-red-dark shadow-glow"
                  : "border-border bg-white text-ink hover:border-auchan-red/40 hover:bg-surface-soft"
              )}
            >
              <span>{choice.label}</span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                  isSelected
                    ? "border-auchan-red bg-auchan-red text-white"
                    : "border-border text-transparent"
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
