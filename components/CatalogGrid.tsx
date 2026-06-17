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
  reserved,
}: {
  src: string | null;
  alt: string;
  reserved?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-64 w-full items-center justify-center bg-surface-container ${
          reserved ? "grayscale-[20%]" : ""
        }`}
      >
        <span className="text-4xl">🐝</span>
      </div>
    );
  }

  return (
    <div className={`relative h-64 w-full bg-surface-container ${reserved ? "grayscale-[20%]" : ""}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const isAvailable = estado === "disponible";

  return (
    <div
      className={`absolute right-sm top-sm inline-flex items-center gap-1 rounded-full px-3 py-1 shadow-sm ${
        isAvailable
          ? "bg-primary-container text-on-primary-container"
          : "bg-tertiary-container text-on-tertiary-container"
      }`}
    >
      <span className="material-symbols-outlined text-[16px]">
        {isAvailable ? "check_circle" : "lock"}
      </span>
      <span className="font-label-md text-label-md">
        {isAvailable ? "Disponible" : "Apartado"}
      </span>
    </div>
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
      {/* Filter toggle — matches Stitch: surface-container-low bg, pill buttons */}
      <div className="flex rounded-full bg-surface-container-low p-xs shadow-[0_2px_10px_rgba(255,179,0,0.05)]">
        <button
          type="button"
          onClick={() => setFilter("todos")}
          className={`rounded-full px-md py-sm font-label-md text-label-md shadow-sm transition-all ${
            filter === "todos"
              ? "bg-surface-container-lowest text-primary"
              : "text-on-surface-variant hover:bg-surface-container-lowest/50"
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setFilter("disponibles")}
          className={`rounded-full px-md py-sm font-label-md text-label-md transition-all ${
            filter === "disponibles"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-lowest/50"
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
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 lg:gap-lg">
          {filteredItems.map((item) => {
            const isReserved = item.estado !== "disponible";
            return (
              <article
                key={item.id}
                className={`flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(255,179,0,0.08)] transition-all duration-300 hover:-translate-y-1 ${
                  isReserved ? "opacity-80" : ""
                }`}
              >
                {/* Image with overlaid badge */}
                <div className="relative">
                  <ImageWithFallback
                    src={item.url_imagen}
                    alt={item.nombre}
                    reserved={isReserved}
                  />
                  <StatusBadge estado={item.estado} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-sm p-md">
                  {/* Name */}
                  <h2
                    className={`font-title-md text-title-md ${
                      isReserved ? "text-on-surface/70" : "text-on-surface"
                    }`}
                  >
                    {item.nombre}
                  </h2>

                  {/* Description */}
                  <p
                    className={`font-body-md text-body-md flex-1 ${
                      isReserved
                        ? "text-on-surface-variant/80"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {item.que_es}
                  </p>

                  {/* Action area */}
                  <div className="mt-auto flex flex-col gap-sm">
                    {isReserved ? (
                      <>
                        <button
                          type="button"
                          disabled
                          className="flex w-full cursor-not-allowed items-center justify-center gap-xs rounded-full bg-surface-variant py-sm font-label-md text-label-md text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            done_all
                          </span>
                          Regalado con amor
                        </button>
                        {item.url_elemento && (
                          <a
                            href={item.url_elemento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-sm text-center font-label-md text-label-md text-on-surface-variant opacity-70 hover:underline"
                          >
                            Ver en la tienda
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setReservingItem(item)}
                          className="flex w-full items-center justify-center gap-xs rounded-full bg-primary py-sm font-label-md text-label-md text-on-primary hover:opacity-90 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            favorite
                          </span>
                          Yo lo regalo
                        </button>
                        {item.url_elemento && (
                          <a
                            href={item.url_elemento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-sm text-center font-label-md text-label-md text-primary hover:underline"
                          >
                            Ver en la tienda
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
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
