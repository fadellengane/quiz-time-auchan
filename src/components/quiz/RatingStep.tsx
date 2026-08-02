"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Heart, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Outcome = "idle" | "positive" | "neutral";

export function RatingStep({
  googleReviewUrl,
  onRate,
  onGoogleClick,
}: {
  googleReviewUrl: string;
  onRate: (rating: number) => void;
  onGoogleClick: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>("idle");

  function handleRate(value: number) {
    if (outcome !== "idle") return;
    setRating(value);
    onRate(value);
    setTimeout(() => setOutcome(value >= 4 ? "positive" : "neutral"), 350);
  }

  return (
    <motion.div
      key="rating"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <AnimatePresence mode="wait">
        {outcome === "idle" && (
          <motion.div
            key="stars"
            exit={{ opacity: 0, y: -12 }}
            className="flex w-full flex-col items-center gap-6"
          >
            <h2 className="max-w-xs text-xl font-semibold leading-snug text-ink sm:text-2xl">
              Comment s&apos;est passée votre visite aujourd&apos;hui ?
            </h2>

            <div className="flex gap-2" role="radiogroup" aria-label="Note sur 5 étoiles">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = (hovered || rating) >= value;
                return (
                  <motion.button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.08 }}
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => handleRate(value)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-9 w-9 transition-colors duration-150 sm:h-10 sm:w-10",
                        active
                          ? "fill-auchan-red text-auchan-red"
                          : "fill-transparent text-ink/20"
                      )}
                      strokeWidth={1.5}
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {outcome === "positive" && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="flex w-full flex-col items-center gap-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-auchan-red-light"
            >
              <Heart className="h-8 w-8 fill-auchan-red text-auchan-red" />
            </motion.div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">
                Merci beaucoup ❤️
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-ink/60">
                Votre participation est enregistrée. Votre avis nous aide
                énormément.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="google"
              className="w-full"
              onClick={onGoogleClick}
            >
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <GoogleG /> Laisser un avis Google <ExternalLink className="h-4 w-4 opacity-50" />
              </a>
            </Button>
          </motion.div>
        )}

        {outcome === "neutral" && (
          <motion.div
            key="neutral"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="flex w-full flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
            >
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </motion.div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">
                Merci pour votre participation.
              </h2>
              <p className="text-sm text-ink/60">À bientôt chez Auchan !</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-13.9 4.2-17.2 10.4z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.9 39.7 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.6 5.6C40.9 36.5 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
