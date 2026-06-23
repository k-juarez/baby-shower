import { sql } from "@/lib/db";

const VALID_TOKEN = "7faff892-dcf4-4c1b-8b3b-91d0d082048d";

interface ReservationRow {
  id: number;
  nombre_corto: string;
  nombre: string;
  tienda: string | null;
  url_elemento: string | null;
  estado: string;
  reservado_por: string;
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (token !== VALID_TOKEN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <span className="text-5xl">🐝</span>
          <p className="mt-4 text-lg font-semibold text-foreground">
            No encontrado
          </p>
        </div>
      </div>
    );
  }

  let reservations: ReservationRow[] = [];
  let error: string | null = null;

  try {
    const rows = (await sql`
      SELECT id, nombre_corto, nombre, tienda, url_elemento, estado, reservado_por
      FROM items
      WHERE reservado_por IS NOT NULL AND reservado_por != '' AND activo = true
      ORDER BY id
    `) as ReservationRow[];

    reservations = rows;
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al consultar la base de datos";
  }

  // Flatten multi-name reservations into individual rows
  const flat: Array<{ guest: string; item: ReservationRow }> = [];
  for (const item of reservations) {
    const names = item.reservado_por.split(",").map((n) => n.trim()).filter(Boolean);
    for (const name of names) {
      flat.push({ guest: name, item });
    }
  }

  // Group by guest
  const byGuest = new Map<string, ReservationRow[]>();
  for (const { guest, item } of flat) {
    const existing = byGuest.get(guest) || [];
    existing.push(item);
    byGuest.set(guest, existing);
  }

  const guests = Array.from(byGuest.entries()).sort(([a], [b]) =>
    a.localeCompare(b, "es"),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            🐝 Panel de Regalos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {flat.length} reserva{flat.length !== 1 ? "s" : ""} de {guests.length} invitado
            {guests.length !== 1 ? "s" : ""}
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">Error: {error}</p>
          </div>
        ) : flat.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <span className="text-4xl">🎁</span>
            <p className="mt-3 text-muted-foreground">
              Aún no hay regalos reservados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {guests.map(([guest, items]) => (
              <section
                key={guest}
                className="overflow-hidden rounded-3xl bg-card shadow-sm"
              >
                <div className="border-b border-muted bg-accent/30 px-6 py-4">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {guest}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {items.length} regalo{items.length !== 1 ? "s" : ""} reservado
                    {items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-muted text-xs uppercase text-muted-foreground">
                        <th className="px-6 py-3 font-semibold">Regalo</th>
                        <th className="px-6 py-3 font-semibold">Tienda</th>
                        <th className="px-6 py-3 font-semibold">Link</th>
                        <th className="px-6 py-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={`${guest}-${item.id}`}
                          className="border-b border-muted transition-colors hover:bg-muted/50"
                        >
                          <td className="px-6 py-3">
                            <p className="font-semibold text-foreground">
                              {item.nombre_corto}
                            </p>
                            {item.nombre !== item.nombre_corto && (
                              <p className="text-xs text-muted-foreground">
                                {item.nombre}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                            {item.tienda || "—"}
                          </td>

                          <td className="px-6 py-3">
                            {item.url_elemento ? (
                              <a
                                href={item.url_elemento}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-honey underline-offset-2 hover:underline"
                              >
                                Comprar
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
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
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                item.estado === "apartado"
                                  ? "bg-available text-available-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {item.estado === "apartado" ? "Apartado" : item.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Panel administrativo — Baby Shower de Natalia 🐝
        </footer>
      </div>
    </div>
  );
}
