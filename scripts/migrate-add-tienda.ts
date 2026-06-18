import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const nombresCortos: Record<number, string> = {
  1:  'Certificado de Regalo',
  2:  'Esterilizador y Secador',
  3:  'Cucharas Suaves 4-pack',
  4:  'Kit Cuello Delgado Niña',
  5:  'Dispensador de Medicamentos',
  6:  'Dispensador de Fórmula',
  7:  'Protectores de Lactancia',
  8:  'Pacha Options Plus 2-pack',
  9:  'Conjunto Jumper y Body',
  10: 'Pijama Estampado Helados',
  11: 'Pijama con Pies Cordero',
  12: 'Set 2 Frazadas Rosadas',
  13: 'Conjunto Jumper y Blusa',
  14: 'Esterilizador y Calentador',
  15: 'Kit Cuello Ancho Unisex',
  16: 'Conjunto 3 Piezas Floral',
  17: 'Cepillo para Pachas',
  18: 'Sujetador de Chupón',
  19: 'Escurridor para Pachas',
  20: 'Mordedor Gira y Tuerce',
  21: 'Vaso Entrenador 360',
  22: 'Conjunto 3 Piezas Daisy',
  23: 'Conjunto Body y Pantalón',
  24: 'Pijama Conejito Lila',
  25: 'Toallitas 12-pack',
  26: 'Conjunto Falda Tutú',
  27: 'Dispensador de Fruta',
  28: 'Baberos Bandana 5-pack',
  29: 'Bolsas Leche Materna',
  30: 'Cepillo para Pachas Lila',
  31: 'Extractor de Leche',
  32: 'Baberos Bandana 5-pack',
};

async function main() {
  // 1. Add columns
  console.log('Adding columns...');
  await sql`ALTER TABLE items ADD COLUMN IF NOT EXISTS tienda TEXT`;
  await sql`ALTER TABLE items ADD COLUMN IF NOT EXISTS nombre_corto TEXT`;
  console.log('✓ Columns added');

  // 2. Set tienda = 'Kinder' for all
  await sql`UPDATE items SET tienda = 'Kinder'`;
  console.log('✓ tienda = "Kinder" for all rows');

  // 3. Set nombre_corto per id
  for (const [idStr, nombre] of Object.entries(nombresCortos)) {
    const id = parseInt(idStr, 10);
    await sql`UPDATE items SET nombre_corto = ${nombre} WHERE id = ${id}`;
  }
  console.log('✓ nombre_corto set for all rows');

  // 4. Verify
  const rows = await sql`SELECT id, nombre_corto, tienda, nombre FROM items ORDER BY id`;
  for (const row of rows) {
    console.log(`  #${row.id}: "${row.nombre_corto}" [${row.tienda}] <- ${row.nombre.substring(0, 50)}...`);
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
