"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReservationModal from "./ReservationModal";

export interface CatalogItem {
  id: number;
  nombre: string;
  que_es: string;
  url_imagen: string | null;
  url_elemento: string | null;
  estado: string;
  tienda: string | null;
  nombre_corto: string | null;
}

interface CatalogGridProps {
  items: CatalogItem[];
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ImageWithFallback({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <span className="text-6xl">🐝</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

type FilterMode = "todos" | "disponibles";

export default function CatalogGrid({ items }: CatalogGridProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterMode>("disponibles");
  const [reservingItem, setReservingItem] = useState<CatalogItem | null>(null);

  const filteredItems =
    filter === "disponibles"
      ? items.filter((item) => item.estado === "disponible")
      : [...items].sort((a, b) => {
          if (a.estado === 'disponible' && b.estado !== 'disponible') return -1;
          if (a.estado !== 'disponible' && b.estado === 'disponible') return 1;
          return 0;
        });

  const availableCount = items.filter(
    (i) => i.estado === "disponible",
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Filter pills */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setFilter("disponibles")}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === "disponibles"
                ? "bg-honey text-honey-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Disponibles ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("todos")}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === "todos"
                ? "bg-honey text-honey-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({items.length})
          </button>
        </div>
      </div>

      {/* Card grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="text-4xl">🐝</span>
          <p className="text-muted-foreground">
            No hay regalos disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isReserved = item.estado !== "disponible";
            return (
              <article
                key={item.id}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-[var(--shadow-soft)] ${
                  isReserved ? "opacity-70" : ""
                }`}
              >
                {/* Image with badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.url_imagen}
                    alt={item.nombre}
                  />
                  {!isReserved && (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-available px-3 py-1 text-xs font-bold text-available-foreground">
                      <IconCheck />
                      Disponible
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-lg font-bold text-foreground">
                    {item.nombre_corto}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.nombre}
                  </p>

                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    {item.tienda}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex flex-col gap-2">
                    {isReserved ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-full bg-muted py-2.5 text-sm font-semibold text-muted-foreground"
                      >
                        Regalado con amor
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReservingItem(item)}
                        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-honey py-2.5 text-sm font-semibold text-honey-foreground transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <IconGift />
                        Yo lo regalo
                      </button>
                    )}

                    {item.url_elemento && (
                      <a
                        href={item.url_elemento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <IconExternalLink />
                        Ver en la tienda
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Reservation modal */}
      {reservingItem && (
        <ReservationModal
          item={reservingItem}
          onClose={() => {
            setReservingItem(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
