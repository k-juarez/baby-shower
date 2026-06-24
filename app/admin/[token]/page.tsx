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
  precio_q: number | null;
}

function formatPrice(n: number): string {
  const v = Number(n);
  return v % 1 === 0 ? `Q${v}` : `Q${v.toFixed(2)}`;
}

interface FlatRow {
  guest: string;
  item: ReservationRow;
}

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ showPrices?: string }>;
}) {
  const { token } = await params;
  const { showPrices } = await searchParams;
  const showPriceBadge = showPrices === "true";

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
      SELECT id, nombre_corto, nombre, tienda, url_elemento, estado, reservado_por, precio_q
      FROM items
      WHERE reservado_por IS NOT NULL AND reservado_por != '' AND activo = true
      ORDER BY id
    `) as ReservationRow[];

    reservations = rows;
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Error al consultar la base de datos";
  }

  // Flatten multi-name reservations and sort by guest name
  const flat: FlatRow[] = [];
  for (const item of reservations) {
    const names = item.reservado_por
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    for (const name of names) {
      flat.push({ guest: name, item });
    }
  }
  flat.sort((a, b) => a.guest.localeCompare(b.guest, "es"));

  // Assign alternating guest group for visual striping
  let guestIndex = 0;
  let prevGuest = "";
  const rows: Array<FlatRow & { group: number }> = [];
  for (const row of flat) {
    if (row.guest !== prevGuest) {
      prevGuest = row.guest;
      guestIndex++;
    }
    rows.push({ ...row, group: guestIndex });
  }

  const guestCount = guestIndex;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            🐝 Panel de Regalos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {flat.length} reserva{flat.length !== 1 ? "s" : ""} &middot;{" "}
            {guestCount} invitado{guestCount !== 1 ? "s" : ""}
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
          <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-muted text-xs uppercase text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">Invitado</th>
                    <th className="px-6 py-3 font-semibold">Regalo</th>
                    <th className="px-6 py-3 font-semibold">Tienda</th>
                    <th className="px-6 py-3 font-semibold">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ guest, item, group }) => (
                    <tr
                      key={`${guest}-${item.id}`}
                      className={`border-b border-muted/60 transition-colors hover:bg-muted/60 ${
                        group % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="px-6 py-3">
                        <span className="font-semibold text-foreground">
                          {guest}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">
                            {item.nombre_corto}
                          </p>
                          {showPriceBadge && item.precio_q != null && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                              {formatPrice(item.precio_q)}
                            </span>
                          )}
                        </div>
                        {item.nombre !== item.nombre_corto && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
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
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-honey/10 px-3 py-1 text-xs font-semibold text-honey transition-colors hover:bg-honey/20"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Panel administrativo &middot; Baby Shower de Natalia 🐝
        </footer>
      </div>
    </div>
  );
}
