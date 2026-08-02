"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { questionSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { z } from "zod";

type FormValues = z.infer<typeof questionSchema>;

/** Génère un court identifiant local pour un choix (pas besoin d'UUID complet). */
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const EMPTY: FormValues = {
  label: "",
  choices: [
    { id: genId(), label: "" },
    { id: genId(), label: "" },
  ],
  correctChoiceId: "",
};

export function QuestionEditor() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: EMPTY,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "choices" });
  const correctChoiceId = watch("correctChoiceId");
  const currentChoices = watch("choices");

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success("Nouvelle question publiée et quiz activé !");
      reset({
        label: "",
        choices: [
          { id: genId(), label: "" },
          { id: genId(), label: "" },
        ],
        correctChoiceId: "",
      });
      router.refresh();
    } catch {
      toast.error("Impossible d'enregistrer la question.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="label">Question</Label>
        <Textarea
          id="label"
          placeholder="Combien est cagnotté tous les jours sur des centaines de produits Auchan ?"
          {...register("label")}
        />
        {errors.label && <p className="text-xs text-auchan-red">{errors.label.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Réponses</Label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => {
            // `field.id` est l'id interne de react-hook-form (clé de rendu),
            // différent de l'id métier du choix. On lit ce dernier via `watch`.
            const choiceId = currentChoices?.[index]?.id ?? field.id;
            return (
              <div key={field.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setValue("correctChoiceId", choiceId)}
                  title="Marquer comme bonne réponse"
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    correctChoiceId === choiceId
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-border text-ink/25 hover:text-ink/50"
                  )}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                <Input
                  placeholder={`Réponse ${index + 1}`}
                  {...register(`choices.${index}.label` as const)}
                />
                <input type="hidden" {...register(`choices.${index}.id` as const)} />
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink/30 hover:text-auchan-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {errors.choices && (
          <p className="text-xs text-auchan-red">{errors.choices.message as string}</p>
        )}
        {errors.correctChoiceId && (
          <p className="text-xs text-auchan-red">{errors.correctChoiceId.message}</p>
        )}

        {fields.length < 6 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ id: genId(), label: "" })}
          >
            <Plus className="h-4 w-4" /> Ajouter une réponse
          </Button>
        )}
      </div>

      <Button type="submit" size="lg" disabled={saving} className="w-fit">
        Publier la question de la semaine
      </Button>
    </form>
  );
}
