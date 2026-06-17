import type { Metadata } from "next";
import { sql } from "@/lib/db";
import CatalogGrid from "@/components/CatalogGrid";

export const metadata: Metadata = {
  title: "Mesa de Regalos — Baby Shower de Natalia",
  description:
    "Elige un regalo especial para la llegada de Natalia desde nuestra mesa de regalos.",
};

interface Item {
  id: number;
  nombre: string;
  que_es: string;
  url_imagen: string | null;
  url_elemento: string | null;
  estado: string;
}

export default async function CatalogoPage() {
  let items: Item[] = [];

  try {
    const rows = await sql`SELECT * FROM items ORDER BY id`;
    items = rows as unknown as Item[];
  } catch {
    // Database error — rendered as empty state below
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Honeycomb header */}
      <div className="bg-honeycomb border-b border-outline-variant/40">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
          <h1
            className="text-4xl font-bold tracking-tight text-primary sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            🐝 Mesa de Regalos
          </h1>
          <p
            className="max-w-xl text-on-surface-variant sm:text-lg"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Con todo nuestro cariño, hemos preparado esta mesa de regalos para
            la llegada de Natalia. Elige el regalo que más te guste y ayúdanos
            a hacer de su llegada algo inolvidable. 💛
          </p>
        </div>
      </div>

      {/* Catalog content */}
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
        {items.length === 0 ? (
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
