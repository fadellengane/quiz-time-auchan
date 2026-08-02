import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne intelligemment des classes Tailwind (usage shadcn/ui classique). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un numéro de téléphone français saisi brut : "0612345678" -> "06 12 34 56 78" */
export function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
