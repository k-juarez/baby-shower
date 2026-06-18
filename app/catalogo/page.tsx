"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CatalogGrid, { type CatalogItem } from "@/components/CatalogGrid";

function IconArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export default function CatalogoPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          setItems(data.items);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="honeycomb-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Inicio
        </Link>

        {/* Header */}
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Catálogo de regalos{" "}
            <span role="img" aria-label="abeja">
              🐝
            </span>
          </h1>

        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-muted border-t-honey" />
              <p className="text-muted-foreground">Cargando regalos...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-5xl">🐝</span>
              <h2 className="text-xl font-bold text-foreground">
                Estamos preparando los regalos
              </h2>
              <p className="max-w-md text-muted-foreground">
                ¡Vuelve pronto! Estamos preparando la lista con mucho cariño.
              </p>
            </div>
          ) : (
            <CatalogGrid items={items} />
          )}
        </div>
      </div>
    </div>
  );
}
