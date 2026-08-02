"use client";

import { motion } from "framer-motion";
import { PartyPopper, Timer, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeStep({
  reward,
  storeName,
  onStart,
}: {
  reward: string;
  storeName?: string;
  onStart: () => void;
}) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center gap-6 px-2 py-4"
    >
      <motion.div
        initial={{ scale: 0.7, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-auchan-red-light"
      >
        <PartyPopper className="h-10 w-10 text-auchan-red" strokeWidth={1.75} />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Quiz Time Auchan
        </h1>
        {storeName && (
          <p className="text-sm font-medium text-ink/45">{storeName}</p>
        )}
      </div>

      <p className="max-w-sm text-balance text-base leading-relaxed text-ink/60">
        Répondez à une question en moins de 30 secondes et tentez de gagner{" "}
        <span className="font-semibold text-ink">{reward}</span>.
      </p>

      <div className="flex items-center gap-4 text-xs font-medium text-ink/45">
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-4 w-4" /> 30 secondes
        </span>
        <span className="h-1 w-1 rounded-full bg-ink/20" />
        <span className="inline-flex items-center gap-1.5">
          <Gift className="h-4 w-4" /> 1 question
        </span>
      </div>

      <Button size="lg" onClick={onStart} className="mt-2 w-full sm:w-auto">
        Commencer
      </Button>
    </motion.div>
  );
}
