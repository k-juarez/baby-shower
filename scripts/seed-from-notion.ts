import 'dotenv/config';
import { Client } from '@notionhq/client';
import { sql } from '../lib/db';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN) {
  console.error('ERROR: NOTION_TOKEN environment variable is not set');
  process.exit(1);
}

if (!NOTION_DATABASE_ID) {
  console.error('ERROR: NOTION_DATABASE_ID environment variable is not set');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

interface NotionItem {
  nombre: string;
  que_es: string | null;
  url_imagen: string | null;
  url_elemento: string | null;
  tienda?: string | null;
  nombre_corto?: string | null;
}

function extractProperties(page: any): NotionItem | null {
  try {
    const props = page.properties;

    // Extract Name (title property)
    const nombre =
      props.Nombre?.title?.[0]?.plain_text ??
      props.Name?.title?.[0]?.plain_text ??
      null;

    if (!nombre) {
      console.warn(`  ⚠ Skipping page ${page.id}: no name/title found`);
      return null;
    }

    // Extract "Qué es" (rich_text property)
    const queEsRaw = props["Qué es"] ?? props["Que es"] ?? null;
    const que_es = queEsRaw?.rich_text?.[0]?.plain_text ?? null;

    // Extract "URL de la imagen" (url property)
    const urlImagenRaw = props["URL de la imagen"] ?? props["URL de la imagen"] ?? null;
    const url_imagen = urlImagenRaw?.url ?? null;

    // Extract "URL del elemento" (url property)
    const urlElementoRaw = props["URL del elemento"] ?? props["URL del elemento"] ?? null;
    const url_elemento = urlElementoRaw?.url ?? null;

    return { nombre, que_es, url_imagen, url_elemento };
  } catch (err) {
    console.warn(`  ⚠ Error extracting properties for page ${page.id}:`, err);
    return null;
  }
}

async function seed() {
  console.log('Fetching items from Notion database...');
  console.log(`  Database ID: ${NOTION_DATABASE_ID}\n`);

  let allItems: NotionItem[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;
  let pageCount = 0;

  // Paginate through all results
  while (hasMore) {
    try {
      const queryParams: Record<string, unknown> = {
        data_source_id: NOTION_DATABASE_ID,
        result_type: 'page',
        page_size: 100,
      };
      if (cursor) {
        queryParams.start_cursor = cursor;
      }
      const response = await notion.dataSources.query(queryParams as any);

      for (const page of response.results) {
        const item = extractProperties(page);
        if (item) {
          allItems.push(item);
        }
      }

      pageCount += response.results.length;
      hasMore = response.has_more;
      cursor = response.next_cursor ?? undefined;
    } catch (err) {
      console.error(`ERROR: Failed to query Notion database at cursor ${cursor}:`, err);
      process.exit(1);
    }
  }

  console.log(`Fetched ${pageCount} total pages from Notion.`);
  console.log(`Extracted ${allItems.length} valid items.\n`);

  if (allItems.length === 0) {
    console.log('No items to insert. Exiting.');
    process.exit(0);
  }

  // Insert items into the database
  let inserted = 0;
  let failed = 0;

  for (const item of allItems) {
    try {
      await sql`
        INSERT INTO items (nombre, que_es, url_imagen, url_elemento, tienda, nombre_corto)
        VALUES (${item.nombre}, ${item.que_es}, ${item.url_imagen}, ${item.url_elemento}, ${item.tienda || 'Kinder'}, ${item.nombre_corto || item.nombre})
      `;
      inserted++;
    } catch (err) {
      console.warn(`  ⚠ Failed to insert item "${item.nombre}":`, err);
      failed++;
    }
  }

  console.log('\n--- Seed Complete ---');
  console.log(`  Total items fetched from Notion: ${allItems.length}`);
  console.log(`  Successfully inserted: ${inserted}`);
  console.log(`  Failed/skipped: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

seed().catch((err) => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
