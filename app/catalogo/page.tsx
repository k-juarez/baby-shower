"use client";

import { useEffect, useState } from "react";
import CatalogGrid, { type CatalogItem } from "@/components/CatalogGrid";

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
    <div className="flex flex-1 flex-col">
      {/* Honeycomb decorative header background */}
      <div className="relative w-full">
        <div className="absolute top-0 left-0 h-64 w-full -z-10 bg-honeycomb rounded-b-full" />
      </div>

      {/* Header & Filters */}
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-md md:px-gutter py-xl">
        <div className="mb-lg flex flex-col items-start gap-md md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-xs flex items-center gap-xs text-primary">
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hive
              </span>
              Mesa de Regalos
            </h1>
            <p className="font-body-md text-body-md max-w-2xl text-on-surface-variant">
              Ayúdanos a preparar la llegada de nuestra abejita. Hemos
              seleccionado con mucho amor estos artículos esenciales.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary-container border-t-primary" />
            <p className="text-on-surface-variant">Cargando regalos...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <span className="text-5xl">🐝✨</span>
            <h2
              className="text-2xl font-semibold text-on-surface"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estamos preparando los regalos
            </h2>
            <p className="max-w-md text-on-surface-variant">
              ¡Vuelve pronto! Estamos preparando la mesa de regalos con mucho
              cariño para que puedas elegir el regalo perfecto para Natalia.
            </p>
          </div>
        ) : (
          <CatalogGrid items={items} />
        )}
      </div>
    </div>
  );
}
