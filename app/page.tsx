import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Baby Shower de Natalia — Little Honey Bee",
  description:
    "Mesa de regalos para la llegada de Natalia. Explora nuestro catálogo, aparta tu regalo y celebra con nosotros la llegada de la Little Honey Bee.",
};

const steps = [
  {
    emoji: "🔍",
    title: "Explora",
    description:
      "Navega por nuestro catálogo de regalos preparados con cariño para la llegada de Natalia.",
  },
  {
    emoji: "💛",
    title: "Aparta",
    description:
      "Elige el regalo que más te guste y apártalo para que nadie más lo reserve.",
  },
  {
    emoji: "🎁",
    title: "Compra",
    description:
      "Recibe los datos para completar tu regalo. ¡Gracias por ser parte de este momento!",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero section */}
      <div className="bg-honeycomb border-b border-outline-variant/40">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6 py-16 text-center sm:py-24">
          {/* Decorative bee emojis */}
          <div className="flex gap-3 text-3xl sm:text-4xl" aria-hidden="true">
            <span>🐝</span>
            <span>🌸</span>
            <span>🐝</span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Baby Shower de Natalia
          </h1>

          <p
            className="text-lg font-semibold text-on-primary-container sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Little Honey Bee 🍯
          </p>

          <p
            className="max-w-2xl text-on-surface-variant sm:text-lg"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Estamos celebrando la llegada de nuestra pequeña Natalia y queremos
            que nos acompañes en este momento tan especial. Hemos preparado una
            mesa de regalos con mucho cariño para que puedas elegir el detalle
            perfecto para ella. ¡Cada regalo es una bienvenida llena de amor!
          </p>

          <Link
            href="/catalogo"
            className="inline-block rounded-full bg-primary px-8 py-3 text-lg font-semibold text-on-primary shadow-lg transition-all hover:bg-primary-fixed-dim hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ver catálogo de regalos 🎀
          </Link>
        </div>
      </div>

      {/* How it works section */}
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:py-20">
        <h2
          className="mb-10 text-center text-3xl font-bold text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ¿Cómo funciona?
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-4 rounded-xl bg-surface-container-low p-8 text-center shadow-amber transition-shadow hover:shadow-lg"
            >
              <span className="text-5xl" aria-hidden="true">
                {step.emoji}
              </span>
              <h3
                className="text-xl font-semibold text-on-surface"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-on-surface-variant"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
