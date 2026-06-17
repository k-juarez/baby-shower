"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  // Don't show nav on transactional pages if needed
  // Currently shows on all pages

  return (
    <>
      {/* ── Desktop Top Nav Bar (hidden on mobile) ── */}
      <nav className="sticky top-0 z-40 hidden bg-surface shadow-sm md:flex">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-md py-sm">
          {/* Brand */}
          <Link
            href="/"
            className="font-display text-display-lg text-primary hover:opacity-90 transition-opacity"
          >
            Natalia Juárez
          </Link>

          {/* Links */}
          <div className="flex items-center gap-md">
            <Link
              href="/catalogo"
              className={`font-title-md text-title-md transition-colors ${
                pathname === "/catalogo"
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Mesa de Regalos
            </Link>
            <a
              href="#"
              className="font-title-md text-title-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Nuestra Historia
            </a>
            <a
              href="#"
              className="font-title-md text-title-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Cómo Apartar
            </a>
          </div>

          {/* Action icons */}
          <div className="flex gap-sm">
            <button
              type="button"
              className="scale-95 rounded-full p-2 text-primary transition-colors duration-200 ease-in-out hover:bg-secondary-container"
              aria-label="Favoritos"
            >
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button
              type="button"
              className="scale-95 rounded-full p-2 text-primary transition-colors duration-200 ease-in-out hover:bg-secondary-container"
              aria-label="Carrito"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav Bar (hidden on desktop) ── */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-low p-xs pb-6 pt-3 shadow-[0_-4px_12px_rgba(255,179,0,0.08)] md:hidden">
        <Link
          href="/catalogo"
          className={`flex flex-col items-center justify-center transition-transform hover:opacity-80 ${
            pathname === "/catalogo"
              ? "text-on-primary-container"
              : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined mb-1">card_giftcard</span>
          <span className="font-label-md text-[12px]">Regalos</span>
        </Link>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant transition-transform hover:opacity-80"
        >
          <span className="material-symbols-outlined mb-1">chat_bubble</span>
          <span className="font-label-md text-[12px]">Mensajes</span>
        </a>
        <a
          href="#"
          className="flex scale-90 flex-col items-center justify-center rounded-full bg-primary-container px-4 py-1 text-on-primary-container shadow-sm transition-transform"
        >
          <span
            className="material-symbols-outlined mb-1 text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            list_alt
          </span>
          <span className="font-label-md text-[12px]">Lista</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant transition-transform hover:opacity-80"
        >
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-md text-[12px]">Perfil</span>
        </a>
      </nav>
    </>
  );
}
