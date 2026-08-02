"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

/**
 * Étape 3 : formulaire client.
 *
 * NB architecture : ce composant reçoit uniquement `onSubmit`. Le jour où
 * l'API du compte fidélité Auchan sera disponible, il suffira d'ajouter un
 * hook `useLoyaltyLookup()` en amont qui pré-remplira `defaultValues`
 * (voire sautera complètement cette étape) sans toucher au reste du flux.
 */
export function ContactFormStep({
  onSubmit,
}: {
  onSubmit: (values: ContactFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">
          Vos coordonnées
        </h2>
        <p className="mt-1 text-sm text-ink/50">
          Pour vous recontacter si vous gagnez.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="Camille"
              error={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-auchan-red">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Dupont"
              error={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-auchan-red">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              className="pl-11"
              error={!!errors.phone}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-auchan-red">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cardNumber">Numéro de carte Auchan</Label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <Input
              id="cardNumber"
              inputMode="numeric"
              placeholder="1234567890123"
              className="pl-11"
              error={!!errors.cardNumber}
              {...register("cardNumber")}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-auchan-red">{errors.cardNumber.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2 w-full"
        >
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
}

// Icône décorative utilisée pour l'en-tête si besoin ailleurs.
export const ContactIcon = User;
