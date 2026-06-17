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

  // Guard clause: don't render if no item
  if (!item) return null;
  const modalItem = item; // Narrowed reference for closures

  // Reset state when item changes
  useEffect(() => {
    setView("idle");
    setGuestName("");
    setNameError(null);
    setApiError(null);
    setRetryTimeout(false);
  }, [modalItem.id]);

  // Close on Esc key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
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

    // Timeout after 15 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setRetryTimeout(true);
    }, 15000);

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: modalItem.id, guestName: guestName.trim() }),
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
        // 400 validation or 500 server error — generic with retry
        let detail = "Ocurrió un error inesperado. Intenta de nuevo.";
        try {
          const errBody = (await response.json()) as ApiError;
          if (errBody?.detail) detail = errBody.detail;
        } catch {
          // Non-JSON response — treat as network error
        }
        setView("error");
        setApiError(detail);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setView("error");
        setApiError("Tardando más de lo esperado... Revisa tu conexión e intenta de nuevo.");
      } else {
        setView("error");
        setApiError("No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.");
      }
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleRetry() {
    setView("idle");
    setApiError(null);
    setRetryTimeout(false);
  }

  // ── Success View ──
  function renderSuccess(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-5xl">🎉</span>
        <h2
          className="text-2xl font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ¡Gracias, {guestName.trim()}! 🐝
        </h2>
        <p
          className="text-on-surface-variant"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Has apartado <strong>{modalItem.nombre}</strong> para la llegada de
          Natalia. Con tu ayuda haremos de su llegada algo inolvidable. 💛
        </p>
        <div className="mt-2 flex flex-col gap-3">
          <a
            href={modalItem.url_elemento ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-fixed-dim"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Ir a la tienda para comprarlo →
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline bg-surface-container-lowest px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            style={{ fontFamily: "var(--font-sans)" }}
          >
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
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-5xl">{isConflict ? "🔒" : "😅"}</span>
        <h2
          className="text-xl font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isConflict
            ? "Este regalo ya no está disponible"
            : "Algo salió mal"}
        </h2>
        <p
          className="text-on-surface-variant"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {apiError}
        </p>
        <div className="mt-2 flex flex-col gap-3">
          {isConflict ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed-dim"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Entendido
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed-dim"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Intentar de nuevo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline bg-surface-container-lowest px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Loading View ──
  function renderLoading(): ReactNode {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary-container border-t-primary" />
        <p
          className="text-on-surface-variant"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Apartando tu regalo...
        </p>
        {retryTimeout && (
          <p className="text-sm text-error" style={{ fontFamily: "var(--font-sans)" }}>
            Tardando más de lo esperado...
          </p>
        )}
      </div>
    );
  }

  // ── Idle View ──
  function renderIdle(): ReactNode {
    const isDisabled = view === "loading";
    return (
      <div className="flex flex-col gap-4">
        {/* Item info */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container">
            {modalItem.url_imagen ? (
              <img
                src={modalItem.url_imagen}
                alt={modalItem.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl">🎁</span>
            )}
          </div>
          <div className="min-w-0">
            <h3
              className="truncate text-lg font-bold text-on-surface"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {modalItem.nombre}
            </h3>
            <p className="line-clamp-1 text-sm text-on-surface-variant">
              {modalItem.que_es}
            </p>
          </div>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="guest-name"
            className="text-sm font-medium text-on-surface"
            style={{ fontFamily: "var(--font-sans)" }}
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
            placeholder="Escribe tu nombre"
            maxLength={100}
            disabled={isDisabled}
            className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              nameError
                ? "border-error focus:ring-error"
                : "border-outline-variant"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled) handleConfirm();
            }}
          />
          {nameError && (
            <p
              className="text-xs text-error"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container shadow-sm transition-all hover:bg-primary-fixed-dim hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {isDisabled ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary-container border-t-transparent" />
              Apartando...
            </>
          ) : (
            <>
              🐝 Confirmar que lo regalaré
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={
        view === "idle"
          ? `Apartar ${modalItem.nombre}`
          : view === "success"
            ? "Regalo apartado con éxito"
            : "Error al apartar regalo"
      }
    >
      <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-lg">
        {view === "idle" && renderIdle()}
        {view === "loading" && renderLoading()}
        {view === "success" && renderSuccess()}
        {view === "error" && renderError()}
      </div>
    </div>
  );
}
