"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Trophy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WinnerResult {
  participation: {
    firstName: string;
    lastName: string;
    phone: string;
    cardNumber: string;
  };
}

export function DrawWinner({ hasEligible }: { hasEligible: boolean }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WinnerResult | null>(null);

  async function handleDraw() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/draw", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data.error === "no_eligible_participants"
            ? "Aucun participant éligible (bonne réponse, pas déjà gagnant)."
            : "Le tirage au sort a échoué."
        );
        return;
      }
      setResult(data);
      toast.success("Gagnant tiré au sort !");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-auchan-red-light">
          <Trophy className="h-8 w-8 text-auchan-red" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink">Tirage au sort</h2>
          <p className="mt-1 max-w-sm text-sm text-ink/50">
            Sélectionne aléatoirement un gagnant parmi les participants ayant
            donné la bonne réponse et pas encore gagné.
          </p>
        </div>

        <Button size="lg" onClick={handleDraw} disabled={loading || !hasEligible}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Tirage en cours..." : "Lancer le tirage au sort"}
        </Button>

        {!hasEligible && !result && (
          <p className="text-xs text-ink/40">
            Aucun participant éligible pour le moment.
          </p>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="w-full rounded-2xl border border-auchan-red/20 bg-auchan-red-light p-6"
            >
              <PartyPopper className="mx-auto mb-2 h-6 w-6 text-auchan-red" />
              <p className="text-lg font-bold text-auchan-red-dark">
                {result.participation.firstName} {result.participation.lastName}
              </p>
              <p className="mt-1 text-sm text-auchan-red-dark/70">
                {result.participation.phone} · Carte {result.participation.cardNumber}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
