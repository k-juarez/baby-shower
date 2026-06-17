export default function Footer() {
  return (
    <footer className="mt-xl w-full border-t border-outline-variant bg-surface-container">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-md px-md py-lg text-center">
        <div className="font-headline-lg text-headline-lg mb-sm text-primary">
          Natalia Juárez
        </div>
        <div className="flex flex-wrap justify-center gap-md">
          <a
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Preguntas Frecuentes
          </a>
          <a
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Contacto
          </a>
          <a
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Aviso de Privacidad
          </a>
        </div>
        <p className="font-body-md text-body-md text-secondary">
          Con amor, Familia Juárez. 2025
        </p>
      </div>
    </footer>
  );
}
