import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { validateReservation } from '@/lib/reserve-validate';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body', detail: 'Request body must be valid JSON' },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const validation = validateReservation({ itemId: data.itemId, guestName: data.guestName });

    if (!validation.valid) {
      return NextResponse.json(
        validation.error!,
        { status: 400 },
      );
    }

    // Fetch current item to check max_reservas
    const items = await sql`SELECT * FROM items WHERE id = ${validation.parsedItemId!}` as Record<string, unknown>[];
    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Not found', detail: 'El artículo no existe' },
        { status: 404 },
      );
    }
    const item = items[0];
    const maxReservas = item.max_reservas as number | null;
    const currentNames = (item.reservado_por as string) || '';

    if (!maxReservas) {
      // Single reservation — current behavior
      const rows = await sql`
        UPDATE items
        SET estado = 'apartado', reservado_por = ${validation.trimmedName!}
        WHERE id = ${validation.parsedItemId!} AND estado = 'disponible'
        RETURNING *
      ` as Record<string, unknown>[];
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Conflict', detail: 'El artículo ya está reservado' },
          { status: 409 },
        );
      }
      item.estado = 'apartado';
      item.reservado_por = validation.trimmedName;
    } else {
      // Multi-reservation
      const names = currentNames ? currentNames.split(', ').filter((n: string) => n) : [];
      if (names.includes(validation.trimmedName!)) {
        return NextResponse.json(
          { error: 'Conflict', detail: 'Ya reservaste este artículo' },
          { status: 409 },
        );
      }
      names.push(validation.trimmedName!);
      const newReservadoPor = names.join(', ');
      const newEstado = names.length >= maxReservas ? 'apartado' : 'disponible';
      await sql`
        UPDATE items
        SET estado = ${newEstado}, reservado_por = ${newReservadoPor}
        WHERE id = ${validation.parsedItemId!}
      `;
      item.estado = newEstado;
      item.reservado_por = newReservadoPor;
      item.reservas_actuales = names.length;
    }

    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      { error: 'Database error', detail: message },
      { status: 500 },
    );
  }
}
