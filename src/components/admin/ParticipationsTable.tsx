"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download, CheckCircle2, XCircle, Star, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParticipationRow } from "@/types";

export function ParticipationsTable() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ParticipationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRows = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/participations?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setRows(data.rows);
      setTotal(data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchRows(query, 1), 300);
    setPage(1);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    fetchRows(query, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
          <Input
            placeholder="Rechercher nom, téléphone, carte..."
            className="pl-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="secondary" asChild>
          <a href="/api/admin/participations/export">
            <Download className="h-4 w-4" /> Exporter en Excel
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-left text-xs font-semibold uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Carte</th>
              <th className="px-4 py-3">Réponse</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Google</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={7}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink/40">
                  Aucune participation trouvée.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-soft/60">
                  <td className="px-4 py-3 font-medium text-ink">
                    <span className="flex items-center gap-1.5">
                      {row.firstName} {row.lastName}
                      {row.isWinner && (
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{row.phone}</td>
                  <td className="px-4 py-3 text-ink/60">{row.cardNumber}</td>
                  <td className="px-4 py-3">
                    {row.isCorrect ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Correcte
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="gap-1">
                        <XCircle className="h-3 w-3" /> Incorrecte
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-ink/70">
                      {row.rating} <Star className="h-3 w-3 fill-current text-amber-400" />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">
                    {row.redirectedToGoogle ? "Oui" : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink/45">
                    {new Date(row.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-ink/50">
        <span>{total} participation(s)</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
