import * as cheerio from "cheerio";
import { neon } from "@neondatabase/serverless";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");
const sql = neon(DB_URL);

const PRODUCT_NOT_FOUND = -1;

// ── Helpers ──

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "es-GT,es;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function cleanPrice(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.,]/g, "").replace(",", "");
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

function guessPrice(text: string): number | null {
  const m = text.match(/(?:Q\.?\s*|GTQ\s*)(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
  if (m) return cleanPrice(m[1]);
  const m2 = text.match(/(?:Q\.?\s*)(\d{2,4})\b/i);
  if (m2) return parseFloat(m2[1]);
  const m3 = text.match(/precio[:\s]*Q?\.?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
  if (m3) return cleanPrice(m3[1]);
  return null;
}

// ── Store-specific extractors ──

async function extractKinder(url: string): Promise<number | null> {
  // Shopify: extract product handle and use .json endpoint
  // NOTE: Kinder's Shopify returns prices in display format (Q100.00), NOT cents
  const match = url.match(/\/products\/([^/?]+)/);
  if (!match) return null;
  const handle = match[1];
  try {
    const json = await fetchJson(
      `https://kinder.com.gt/products/${handle}.json`
    );
    const price = json?.product?.variants?.[0]?.price;
    if (price) {
      const num = parseFloat(price);
      return num > 0 ? num : null;
    }
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes("404")) {
      console.log(`  ⚠️ Producto no encontrado (404) — marcando como inactivo`);
      return PRODUCT_NOT_FOUND;
    }
    console.error(`  Kinder JSON falló: ${msg}`);
  }
  return null;
}

async function extractCemaco(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers?.price) {
          return parseFloat(data.offers.price);
        }
      } catch {}
    }
    const metaPrice = $('meta[property="product:price:amount"]').attr("content");
    if (metaPrice) return parseFloat(metaPrice);
    const priceEl =
      $(".vtex-product-price-1-x-sellingPrice") ||
      $(".vtex-product-price-1-x-currencyContainer");
    if (priceEl.length) return guessPrice(priceEl.first().text().trim());
  } catch (e) {
    console.error(`  Cemaco falló: ${(e as Error).message}`);
  }
  return null;
}

async function extractWalmart(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers?.price) {
          return parseFloat(data.offers.price);
        }
      } catch {}
    }
    const selectors = [
      '[data-testid="price"]', ".product-price", ".price", ".selling-price", '[class*="price"]',
    ];
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const price = guessPrice(el.text().trim());
        if (price) return price;
      }
    }
  } catch (e) {
    console.error(`  Walmart falló: ${(e as Error).message}`);
  }
  return null;
}

async function extractPricesmart(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers?.price) {
          return parseFloat(data.offers.price);
        }
      } catch {}
    }
    const selectors = [".price", '[class*="price"]', ".product-price"];
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const price = guessPrice(el.text().trim());
        if (price) return price;
      }
    }
  } catch (e) {
    console.error(`  Pricesmart falló: ${(e as Error).message}`);
  }
  return null;
}

async function extractZeppelin(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers?.price) {
          return parseFloat(data.offers.price);
        }
      } catch {}
    }
    const priceEl = $(".price .woocommerce-Price-amount").first();
    if (priceEl.length) return guessPrice(priceEl.text().trim());
    const priceEl2 = $(".price").first();
    if (priceEl2.length) return guessPrice(priceEl2.text().trim());
  } catch (e) {
    console.error(`  Zeppelin falló: ${(e as Error).message}`);
  }
  return null;
}

async function extractKemik(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers?.price) {
          return parseFloat(data.offers.price);
        }
      } catch {}
    }
    const dataPrice = $('[data-price]').attr("data-price");
    if (dataPrice) return parseFloat(dataPrice);
    const selectors = [".price", '[class*="price"]', ".product-price", ".amount"];
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const price = guessPrice(el.text().trim());
        if (price) return price;
      }
    }
  } catch (e) {
    console.error(`  Kemik falló: ${(e as Error).message}`);
  }
  return null;
}

async function extractGeneric(url: string): Promise<number | null> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse($(scripts[i]).html() || "{}");
        if (data["@type"] === "Product" && data.offers) {
          const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
          if (offer?.price) return parseFloat(offer.price);
        }
      } catch {}
    }
    const metaPrice = $('meta[property="product:price:amount"]').attr("content");
    if (metaPrice) return parseFloat(metaPrice);
    const selectors = [
      ".price", '[class*="price"]', ".product-price", ".amount",
      ".woocommerce-Price-amount", '[data-price]',
    ];
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const price = guessPrice(el.text().trim());
        if (price) return price;
      }
    }
  } catch (e) {
    console.error(`  Genérico falló: ${(e as Error).message}`);
  }
  return null;
}

// ── Extractor router ──

function getExtractor(tienda: string | null, url: string): (url: string) => Promise<number | null> {
  if (url.includes("kinder.com.gt")) return extractKinder;
  if (url.includes("cemaco.com")) return extractCemaco;
  if (url.includes("walmart.com.gt")) return extractWalmart;
  if (url.includes("pricesmart.com")) return extractPricesmart;
  if (url.includes("elzeppelin.com.gt")) return extractZeppelin;
  if (url.includes("kemik.gt")) return extractKemik;
  return extractGeneric;
}

// ── Main ──

interface Item {
  id: number;
  nombre_corto: string;
  url_elemento: string;
  tienda: string | null;
}

async function main() {
  const items = (await sql`
    SELECT id, nombre_corto, url_elemento, tienda
    FROM items
    WHERE url_elemento IS NOT NULL AND activo = true AND precio_q IS NULL
    ORDER BY id
  `) as Item[];

  console.log(`Items a scrapear: ${items.length}\n`);

  let updated = 0;
  let failed = 0;
  let deactivated = 0;

  for (const item of items) {
    const extract = getExtractor(item.tienda, item.url_elemento);
    console.log(`[${item.id}] ${item.nombre_corto} (${item.tienda})`);

    try {
      const price = await extract(item.url_elemento);

      if (price === PRODUCT_NOT_FOUND) {
        await sql`UPDATE items SET activo = false WHERE id = ${item.id}`;
        console.log(`  🚫 Producto no disponible — marcado como inactivo`);
        deactivated++;
      } else if (price !== null) {
        await sql`UPDATE items SET precio_q = ${price} WHERE id = ${item.id}`;
        console.log(`  ✅ Q${price.toFixed(2)}`);
        updated++;
      } else {
        console.log(`  ❌ No se encontró precio`);
        failed++;
      }
    } catch (e) {
      console.error(`  ❌ Error: ${(e as Error).message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\n── Resultados ──`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Desactivados:  ${deactivated}`);
  console.log(`Fallidos:     ${failed}`);

  if (failed > 0) {
    const failures = (await sql`
      SELECT id, nombre_corto, url_elemento, tienda
      FROM items
      WHERE url_elemento IS NOT NULL AND activo = true AND precio_q IS NULL
      ORDER BY id
    `) as Item[];
    console.log(`\nPendientes (${failures.length}):`);
    for (const f of failures) {
      console.log(`  [${f.id}] ${f.nombre_corto} — ${f.url_elemento}`);
    }
  }
}

main().catch(console.error);
