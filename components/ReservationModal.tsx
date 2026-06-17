"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { CatalogItem } from "./CatalogGrid";

type ModalView = "idle" | "loading" | "success" | "error";

interface ReservationModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

interface ApiError {
  error: string;
  detail: string;
}

export default function ReservationModal({
  item,
  onClose,
}: ReservationModalProps) {
  const [view, setView] = useState<ModalView>("idle");
  const [guestName, setGuestName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryTimeout, setRetryTimeout] = useState(false);

  if (!item) return null;
  const modalItem = item;

  useEffect(() => {
    setView("idle");
    setGuestName("");
    setNameError(null);
    setApiError(null);
    setRetryTimeout(false);
  }, [modalItem.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  function validateName(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length === 0) return "Tu nombre es obligatorio.";
    if (trimmed.length > 100)
      return "El nombre no debe exceder 100 caracteres.";
    return null;
  }

  async function handleConfirm() {
    const error = validateName(guestName);
    if (error) {
      setNameError(error);
      return;
    }
    setNameError(null);

    setView("loading");
    setApiError(null);
    setRetryTimeout(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setRetryTimeout(true);
    }, 15000);

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: modalItem.id,
          guestName: guestName.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setView("success");
      } else if (response.status === 409) {
        setView("error");
        setApiError(
          "Alguien más acaba de apartar este regalo. Elige otro de la lista.",
        );
      } else {
        let detail = "Ocurrió un error inesperado. Intenta de nuevo.";
        try {
          const errBody = (await response.json()) as ApiError;
          if (errBody?.detail) detail = errBody.detail;
        } catch {
          // ignore parse errors
        }
        setView("error");
        setApiError(detail);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setView("error");
        setApiError(
          "Tardando más de lo esperado... Revisa tu conexión e intenta de nuevo.",
        );
      } else {
        setView("error");
        setApiError(
          "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.",
        );
      }
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleRetry() {
    setView("idle");
    setApiError(null);
    setRetryTimeout(false);
  }

  // ── Idle View (matches Stitch reserve page) ──
  function renderIdle(): ReactNode {
    return (
      <div className="flex flex-col gap-md">
        {/* Header with back button */}
        <header className="relative flex items-center pb-sm pt-md">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-title-md text-title-md w-full text-center text-on-surface">
            Reservar Regalo
          </h1>
        </header>

        {/* Product summary card */}
        <section className="flex flex-col gap-md rounded-2xl border border-surface-container bg-surface-container-low p-sm sm:flex-row sm:items-start">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface shadow-sm">
            {modalItem.url_imagen ? (
              <img
                src={modalItem.url_imagen}
                alt={modalItem.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                🎁
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-xs py-xs text-center sm:text-left">
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary">
              {modalItem.que_es}
            </span>
            <h2 className="font-title-md text-title-md leading-tight text-on-surface">
              {modalItem.nombre}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-1 text-on-surface-variant sm:justify-start">
              <span className="material-symbols-outlined text-[16px]">
                check_circle
              </span>
              <span className="text-sm font-body-md">Disponible</span>
            </div>
          </div>
        </section>

        {/* Form */}
        <div className="flex flex-col gap-xs">
          <label
            htmlFor="guest-name"
            className="font-title-md ml-1 text-[15px] text-on-surface"
          >
            Tu nombre
          </label>
          <input
            id="guest-name"
            type="text"
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Escribe tu nombre y apellido"
            maxLength={100}
            className={`w-full rounded-xl border bg-surface-container-lowest px-sm py-3 font-body-md text-body-md text-on-surface shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 ${
              nameError
                ? "border-error focus:border-error focus:ring-error"
                : "border-outline-variant focus:border-primary focus:ring-primary"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
          />
          {nameError && (
            <p className="mt-1 text-xs text-error">{nameError}</p>
          )}
        </div>

        {/* Info box */}
        <div className="mt-xs flex items-start gap-sm rounded-xl border border-primary-container/30 bg-primary-container/20 p-sm">
          <span
            className="mt-0.5 text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <span className="material-symbols-outlined">favorite</span>
          </span>
          <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant">
            Al confirmar, este regalo se marcará como apartado para que nadie
            más lo elija. ¡Gracias por tu detalle!
          </p>
        </div>

        {/* Confirm button */}
        <div className="pt-sm">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-title-md text-title-md text-on-primary shadow-amber transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0"
          >
            Confirmar que lo regalaré
            <span className="material-symbols-outlined text-[20px]">
              volunteer_activism
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Loading View ──
  function renderLoading(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary-container border-t-primary" />
        <p className="text-on-surface-variant">Apartando tu regalo...</p>
        {retryTimeout && (
          <p className="text-sm text-error">
            Tardando más de lo esperado...
          </p>
        )}
      </div>
    );
  }

  // ── Success View (matches Stitch Thank You page) ──
  function renderSuccess(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="relative mb-lg inline-block">
          {/* Glow blob behind */}
          <div className="absolute inset-0 scale-150 rounded-full bg-primary-container opacity-20 blur-2xl" />
          {/* Floating bee */}
          <span className="relative z-10 inline-block animate-[float_4s_ease-in-out_infinite] text-6xl">
            🐝
          </span>
        </div>
        <h2
          className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-sm"
        >
          ¡Muchas gracias por tu regalo para Natalia!
        </h2>
        <p className="font-body-lg text-body-lg mx-auto mb-xl max-w-md text-on-surface-variant">
          Has apartado el regalo con éxito. Tu cariño y apoyo significan el
          mundo para nuestra familia en esta dulce espera.
        </p>
        <div className="flex w-full flex-col gap-md">
          <a
            href={modalItem.url_elemento ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-xs rounded-full bg-primary py-sm px-md font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_bag
            </span>
            Ir a la tienda para comprarlo
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-xs rounded-full bg-secondary-container py-sm px-md font-label-md text-label-md text-on-secondary-container transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed-variant"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  // ── Error View ──
  function renderError(): ReactNode {
    const isConflict = apiError?.includes("acaba de apartar");
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="text-5xl">{isConflict ? "🔒" : "😅"}</span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-on-surface">
          {isConflict
            ? "Este regalo ya no está disponible"
            : "Algo salió mal"}
        </h2>
        <p className="text-on-surface-variant">{apiError}</p>
        <div className="mt-2 flex w-full flex-col gap-3">
          {isConflict ? (
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-sm px-md font-label-md text-label-md text-on-primary transition-colors"
            >
              Entendido
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-sm px-md font-label-md text-label-md text-on-primary transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-outline bg-surface-container-lowest py-sm px-md font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-[24px] border border-surface-container bg-surface-container-lowest shadow-amber">
        {/* Honeycomb background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(#e7e1ae 2px, transparent 2px), radial-gradient(#e7e1ae 2px, transparent 2px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
            opacity: 0.3,
          }}
        />
        <div className="px-md pb-md">
          {view === "idle" && renderIdle()}
          {view === "loading" && renderLoading()}
          {view === "success" && renderSuccess()}
          {view === "error" && renderError()}
        </div>
      </div>
    </div>
  );
}
