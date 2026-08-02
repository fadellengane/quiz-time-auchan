"use client";

import { motion } from "framer-motion";
import { STEP_ORDER, type QuizStep } from "@/lib/constants";
import { cn } from "@/lib/utils";

const VISIBLE_STEPS = STEP_ORDER.filter((s) => s !== "done");

export function ProgressDots({ current }: { current: QuizStep }) {
  if (current === "welcome" || current === "done") return null;

  const currentIndex = VISIBLE_STEPS.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {VISIBLE_STEPS.map((step, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <motion.span
            key={step}
            initial={false}
            animate={{
              width: active ? 24 : 8,
              backgroundColor: active || done ? "#E2001A" : "#EFEFF3",
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn("h-2 rounded-full")}
          />
        );
      })}
    </div>
  );
}
