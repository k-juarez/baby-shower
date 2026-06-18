import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM items WHERE activo = true ORDER BY id`;
    return NextResponse.json({ items: rows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      { error: 'Failed to fetch items', detail: message },
      { status: 500 },
    );
  }
}
