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

function IconArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
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
    if (trimmed.length === 0) return "Escribe tu nombre para continuar.";
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

  // ── Idle View ──
  function renderIdle(): ReactNode {
    return (
      <>
        {/* Header */}
        <div className="relative flex items-center pb-3 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Volver al catálogo"
          >
            <IconArrowLeft />
          </button>
          <h1 className="w-full text-center text-lg font-bold text-foreground">
            Reservar regalo
          </h1>
        </div>

        {/* Item preview card */}
        <section className="flex flex-col gap-4 rounded-2xl border bg-muted/50 p-4 sm:flex-row sm:items-start">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
            {modalItem.url_imagen ? (
              <img
                src={modalItem.url_imagen}
                alt={modalItem.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                🐝
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {modalItem.que_es}
            </span>
            <h2 className="text-base font-bold leading-tight text-foreground">
              {modalItem.nombre}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-1 text-available-foreground sm:justify-start">
              <IconCheck />
              <span className="text-xs font-bold">Disponible</span>
            </div>
          </div>
        </section>

        {/* Name input */}
        <div className="mt-4 flex flex-col gap-1.5">
          <label
            htmlFor="guest-name"
            className="text-sm font-semibold text-foreground"
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
            className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 ${
              nameError
                ? "border-destructive focus:ring-destructive/30"
                : "border-border focus:ring-ring/40"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
          />
          {nameError && (
            <p className="text-xs text-destructive">{nameError}</p>
          )}
        </div>

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey py-3.5 text-base font-semibold text-honey-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Confirmar que lo regalaré
        </button>
      </>
    );
  }

  // ── Loading View ──
  function renderLoading(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-muted border-t-honey" />
        <p className="text-muted-foreground">Apartando tu regalo...</p>
      </div>
    );
  }

  // ── Success View ──
  function renderSuccess(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="relative mb-4 inline-block">
          <div className="absolute inset-0 scale-150 rounded-full bg-honey/15 blur-2xl" />
          <span
            className="relative z-10 inline-block text-6xl"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            🐝
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          ¡Muchas gracias por tu regalo para Natalia!
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Has apartado el regalo con éxito. Tu cariño significa el mundo para
          nuestra familia en esta dulce espera.
        </p>
        <div className="mt-2 flex w-full flex-col gap-3">
          <a
            href={modalItem.url_elemento ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey py-3 text-sm font-semibold text-honey-foreground transition-all hover:-translate-y-0.5 hover:brightness-105"
          >
            Ir a la tienda para comprarlo
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80"
          >
            <IconArrowLeft />
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
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="text-5xl">{isConflict ? "🔒" : "😅"}</span>
        <h2 className="text-xl font-bold text-foreground">
          {isConflict
            ? "Este regalo ya no está disponible"
            : "Algo salió mal"}
        </h2>
        <p className="text-muted-foreground">{apiError}</p>
        <div className="mt-2 flex w-full gap-3">
          {isConflict ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey py-3 text-sm font-semibold text-honey-foreground"
            >
              Entendido
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-honey py-3 text-sm font-semibold text-honey-foreground"
              >
                Intentar de nuevo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </>
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
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[24px] border bg-card shadow-[var(--shadow-soft)]">
        {/* Honeycomb BG */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--honey) 8%, transparent) 1.5px, transparent 1.6px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="px-5 pb-5">
          {view === "idle" && renderIdle()}
          {view === "loading" && renderLoading()}
          {view === "success" && renderSuccess()}
          {view === "error" && renderError()}
        </div>
      </div>
    </div>
  );
}
