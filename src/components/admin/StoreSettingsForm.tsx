"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeSettingsSchema, type StoreSettingsValues } from "@/lib/validations";

export function StoreSettingsForm({
  storeName,
  initialGoogleReviewUrl,
}: {
  storeName: string;
  initialGoogleReviewUrl: string;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: { googleReviewUrl: initialGoogleReviewUrl },
  });

  const currentUrl = watch("googleReviewUrl");

  async function onSubmit(values: StoreSettingsValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Erreur inconnue");
      }

      toast.success("Lien Google mis à jour avec succès");
    } catch {
      toast.error("Impossible d'enregistrer le lien. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>Magasin</Label>
        <p className="text-sm font-medium text-ink">{storeName}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="googleReviewUrl">Lien d&apos;avis Google</Label>
        <Input
          id="googleReviewUrl"
          placeholder="https://g.page/r/XXXXXXXXXXXX/review"
          error={!!errors.googleReviewUrl}
          {...register("googleReviewUrl")}
        />
        {errors.googleReviewUrl && (
          <p className="text-xs text-auchan-red">{errors.googleReviewUrl.message}</p>
        )}
        <p className="text-xs text-ink/45">
          C&apos;est ce lien qui s&apos;ouvre quand un client donne 4 ou 5
          étoiles à la fin du quiz. Vous le trouvez en scannant votre propre
          QR code d&apos;avis, ou via le bouton &laquo;&nbsp;Rédiger un
          avis&nbsp;&raquo; de votre fiche Google.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving || !isDirty}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Enregistrer
        </Button>

        {currentUrl && !errors.googleReviewUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-auchan-red"
          >
            Tester le lien
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </form>
  );
}
