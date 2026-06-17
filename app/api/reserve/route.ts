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

    // Atomic conditional UPDATE — only reserves if item is still 'disponible'
    const rows = await sql`
      UPDATE items
      SET estado = 'apartado', reservado_por = ${validation.trimmedName!}
      WHERE id = ${validation.parsedItemId!} AND estado = 'disponible'
      RETURNING *
    ` as Record<string, unknown>[];

    if (rows.length === 0) {
      // No rows updated — item was already reserved or doesn't exist
      return NextResponse.json(
        { error: 'Conflict', detail: 'El artículo no está disponible o no existe' },
        { status: 409 },
      );
    }

    return NextResponse.json({ item: rows[0] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      { error: 'Database error', detail: message },
      { status: 500 },
    );
  }
}
