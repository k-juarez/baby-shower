import Link from "next/link";

function IconSearch() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function IconShoppingBag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

const steps = [
  {
    number: "1",
    title: "Explora",
    description: "Mira los regalos que nos encantaría recibir.",
    icon: <IconSearch />,
  },
  {
    number: "2",
    title: "Apártalo",
    description: 'Toca «Yo lo regalo» y escribe tu nombre.',
    icon: <IconHeart />,
  },
  {
    number: "3",
    title: "Cómpralo",
    description: "Te llevamos a la tienda para completar la compra.",
    icon: <IconShoppingBag />,
  },
];

export default function HomePage() {
  return (
    <div className="honeycomb-bg flex min-h-screen flex-col">
      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-10 sm:pt-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            🐝 Baby shower
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            ¡Bienvenida Natalia!
            <span role="img" aria-label="abeja">
              {" "}🐝
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Estamos felices de esperar a nuestra pequeña. Preparamos una lista
            de regalos para que puedas elegir el tuyo sin que coincida con el
            de otro ser querido.
          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-honey px-8 py-3 text-base font-semibold text-honey-foreground transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver catálogo de regalos
            </Link>
          </div>

          {/* Hero image */}
          <div className="mt-8 w-full overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)]">
            <img
              src="/bee-hero.jpg"
              alt="Decoración de baby shower con temática de abejas"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>


      {/* How it works */}
      <div className="px-5 pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-foreground">
            ¿Cómo funciona?
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border bg-card p-5 text-center shadow-sm"
              >
                {/* Numbered circle */}
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">{step.number}</span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex items-center justify-center gap-2 pb-8 text-center text-sm text-muted-foreground">
        <IconHeart />
        <span>Gracias por acompañarnos en esta dulce espera</span>
      </div>
    </div>
  );
}
