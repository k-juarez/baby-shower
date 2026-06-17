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
}

interface CatalogGridProps {
  items: CatalogItem[];
}

type FilterMode = "todos" | "disponibles";

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
      <div className="flex aspect-[4/3] items-center justify-center bg-surface-container">
        <span className="text-4xl">🐝</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const isAvailable = estado === "disponible";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        isAvailable
          ? "bg-primary-container text-on-primary-container"
          : "bg-tertiary-container text-on-tertiary-container"
      }`}
    >
      {isAvailable ? "✓" : "🔒"}
      {isAvailable ? "Disponible" : "Apartado"}
    </span>
  );
}

export default function CatalogGrid({ items }: CatalogGridProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterMode>("todos");
  const [reservingItem, setReservingItem] = useState<CatalogItem | null>(null);

  const filteredItems =
    filter === "disponibles"
      ? items.filter((item) => item.estado === "disponible")
      : items;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("todos")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            filter === "todos"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setFilter("disponibles")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            filter === "disponibles"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          Disponibles
        </button>
      </div>

      {/* Card grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="text-4xl">🐝</span>
          <p
            className="text-on-surface-variant"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            No hay regalos disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition duration-300 hover:-translate-y-1"
              style={{
                boxShadow:
                  "0 4px 6px -1px var(--color-shadow-amber), 0 2px 4px -2px var(--color-shadow-amber)",
              }}
            >
              {/* Image */}
              <ImageWithFallback src={item.url_imagen} alt={item.nombre} />

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Status badge */}
                <div>
                  <StatusBadge estado={item.estado} />
                </div>

                {/* Name */}
                <h2
                  className="text-lg font-bold text-on-surface"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.nombre}
                </h2>

                {/* Description */}
                <p
                  className="line-clamp-3 flex-1 text-sm text-on-surface-variant"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.que_es}
                </p>

                {/* Store link */}
                {item.url_elemento && (
                  <a
                    href={item.url_elemento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-fixed-dim"
                  >
                    Ver en la tienda →
                  </a>
                )}

                {/* Yo lo regalo button — only for Disponible items */}
                {item.estado === "disponible" ? (
                  <button
                    type="button"
                    onClick={() => setReservingItem(item)}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary-container shadow-sm transition-all hover:bg-primary-fixed-dim hover:shadow-md"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    🐝 Yo lo regalo
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-surface-container px-4 py-2.5 text-sm font-semibold text-on-surface-variant/50 opacity-60"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    🔒 Apartado
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reservation modal */}
      <ReservationModal
        item={reservingItem}
        onClose={() => {
          setReservingItem(null);
          router.refresh();
        }}
      />
    </div>
  );
}
