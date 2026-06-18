import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const items = [
  { tienda: "Kinder", nombre_corto: "Certificado de Regalo", nombre: "Certificado de Regalo Kinder", que_es: "Tarjeta de regalo", url_imagen: "https://kinder.com.gt/cdn/shop/files/certificado-de-regalo-kinder-9008086.png?v=1770741668&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/tarjeta-de-regalo-kinder" },
  { tienda: "Kinder", nombre_corto: "Esterilizador y Secador", nombre: "Dr. Browns - Esterilizador y secador de pachas.", que_es: "Esterilizador y secador de pachas", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-esterilizador-y-secador-de-pachas-8979755.jpg?v=1770741611&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-esterilizador-y-secador-de-biberones" },
  { tienda: "Kinder", nombre_corto: "Cucharas Suaves 4-pack", nombre: "Dr. Browns - Cucharas Suaves, 4-pack", que_es: "Cucharas para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-cucharas-suaves-4-pack-6215480.jpg?v=1773345613&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-cucharas-suaves-4-pack" },
  { tienda: "Kinder", nombre_corto: "Kit Cuello Delgado Niña", nombre: "Dr. Browns - Kit completo cuello delgado - Niña", que_es: "Kit de pachas cuello delgado", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-kit-completo-cuello-delgado-nina-2501237.jpg?v=1770741668&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-kit-completo-cuello-delgado-nina" },
  { tienda: "Kinder", nombre_corto: "Dispensador de Medicamentos", nombre: "Dr. Browns - Dispensador de medicamentos líquidos Pacidose™ con jeringa oral, 2 u.", que_es: "Dispensador de medicamentos para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-dispensador-de-medicamentos-liquidos-pacidose-con-jeringa-oral-2-u-4909107.jpg?v=1770741611&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-dispensador-de-medicamentos-liquidos-pacidose%E2%84%A2-con-jeringa-oral-2-u" },
  { tienda: "Kinder", nombre_corto: "Dispensador de Fórmula", nombre: "Dr. Brown's - Dispensador de formula rosado", que_es: "Dispensador de fórmula", url_imagen: "https://kinder.com.gt/cdn/shop/files/dr-browns-dispensador-de-formula-rosado-2223749.jpg?v=1773345606&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-ac038" },
  { tienda: "Kinder", nombre_corto: "Protectores de Lactancia", nombre: "Dr. Brown's - Protectores de lactancia desechables", que_es: "Protectores de lactancia", url_imagen: "https://kinder.com.gt/cdn/shop/files/dr-browns-protectores-de-lactancia-desechables-8779351.png?v=1773345486&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-protectores-de-lactancia-desechables-1" },
  { tienda: "Kinder", nombre_corto: "Pacha Options Plus 2-pack", nombre: "Dr. Browns - Pacha Options Plus 5oz Cuello Ancho, Diseño de Bosque, 2-pack", que_es: "Pacha para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-pacha-options-plus-5oz-cuello-ancho-diseno-de-bosque-2-pack-9127530.jpg?v=1773345615&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-pacha-options-plus-5oz-cuello-ancho-diseno-de-bosque-2-pack" },
  { tienda: "Kinder", nombre_corto: "Conjunto Jumper y Body", nombre: "Conjunto 2 piezas Carter's: vestido estilo jumper y body con bolsillos", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-2-piezas-carters-vestido-estilo-jumper-y-body-con-bolsillos-6572604.webp?v=1773925449&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1u616810" },
  { tienda: "Kinder", nombre_corto: "Pijama Estampado Helados", nombre: "Pijama Carter's de algodón estampado de helados para niña", que_es: "Pijama para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/pijama-carters-de-algodon-estampado-de-helados-para-nina-5202566.webp?v=1773842315&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1u618510" },
  { tienda: "Kinder", nombre_corto: "Pijama con Pies Cordero", nombre: "Pijama Carter con pies y zipper doble, diseño de cordero color lila para niña", que_es: "Pijama para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/pijama-carter-con-pies-y-zipper-doble-diseno-de-cordero-color-lila-para-nina-8467545.webp?v=1770946447&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1t369710" },
  { tienda: "Kinder", nombre_corto: "Set 2 Frazadas Rosadas", nombre: "Set de 2 frazadas Chick Pea rosadas niña", que_es: "Frazadas para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/set-de-2-frazadas-chick-pea-rosadas-nina-7076100.png?v=1770741548&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/chick-pea-be1100090" },
  { tienda: "Kinder", nombre_corto: "Conjunto Jumper y Blusa", nombre: "Conjunto jumper y blusa Carter s para niña", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-jumper-y-blusa-carter-s-para-nina-2207259.jpg?v=1773925454&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1u563510" },
  { tienda: "Kinder", nombre_corto: "Esterilizador y Calentador", nombre: "Esterilizador y calentador de pachas", que_es: "Esterilizador y calentador de pachas", url_imagen: "https://kinder.com.gt/cdn/shop/files/esterilizador-y-calentador-de-pachas-7596884.jpg?v=1770741609&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-ac184" },
  { tienda: "Kinder", nombre_corto: "Kit Cuello Ancho Unisex", nombre: "Dr. Browns - Kit completo cuello ancho - Unisex", que_es: "Kit de pachas cuello ancho", url_imagen: "https://kinder.com.gt/cdn/shop/products/dr-browns-kit-completo-cuello-ancho-unisex-2715597.jpg?v=1773345612&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-kit-completo-cuello-ancho-unisex" },
  { tienda: "Kinder", nombre_corto: "Conjunto 3 Piezas Floral", nombre: "Conjunto de 3 piezas Little Me Blusa tela plana, leggins y banda para el cabello floral", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-de-3-piezas-little-me-blusa-tela-plana-leggins-y-banda-para-el-cabello-floral-3982761.png?v=1774340551&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/little-me-lcu17246n" },
  { tienda: "Kinder", nombre_corto: "Cepillo para Pachas", nombre: "LACTANCIA DR. BROWNS - Cepillo para lavar pachas", que_es: "Cepillo para lavar pachas", url_imagen: "https://kinder.com.gt/cdn/shop/files/lactancia-dr-browns-cepillo-para-lavar-pachas-4197212.jpg?v=1770740707&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/lactancia-dr-browns-cepillo-para-lavar-pachas" },
  { tienda: "Kinder", nombre_corto: "Sujetador de Chupón", nombre: "Sujetador para Pepe de Silicón presentación Venadita", que_es: "Sujetador de pepe/chupón", url_imagen: "https://kinder.com.gt/cdn/shop/files/sujetador-para-pepe-de-silicon-presentacion-venadita-4521806.jpg?v=1773345606&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-ac158" },
  { tienda: "Kinder", nombre_corto: "Escurridor para Pachas", nombre: "Escurridor Dr.Browns", que_es: "Escurridor para pachas", url_imagen: "https://kinder.com.gt/cdn/shop/files/escurridor-drbrowns-5043458.webp?v=1773345486&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/escurridor-dr-browns" },
  { tienda: "Kinder", nombre_corto: "Mordedor Gira y Tuerce", nombre: "Mordedor gira y tuerce Playgro, multicolor.", que_es: "Mordedor para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/mordedor-gira-y-tuerce-playgro-multicolor-4035678.jpg?v=1774091166&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/playgro-13833" },
  { tienda: "Kinder", nombre_corto: "Vaso Entrenador 360", nombre: "Vaso Cheers 360 Dr. Browns con agarradores 7oz rosado", que_es: "Vaso entrenador para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/vaso-cheers-360-dr-browns-con-agarradores-7oz-rosado-1970456.webp?v=1778858527&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-tc71005" },
  { tienda: "Kinder", nombre_corto: "Conjunto 3 Piezas Daisy", nombre: "Conjunto de 3 piezas Little Me blusa body, leggins y banda para el cabello Daisy", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-de-3-piezas-little-me-blusa-body-leggins-y-banda-para-el-cabello-daisy-4886526.png?v=1774340560&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/little-me-lc817036n" },
  { tienda: "Kinder", nombre_corto: "Conjunto Body y Pantalón", nombre: "Conjunto de Body y pantalón Carter's para niña color lila", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-de-body-y-pantalon-carters-para-nina-color-lila-3378251.png?v=1773842251&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1v070510" },
  { tienda: "Kinder", nombre_corto: "Pijama Conejito Lila", nombre: "Pijama Carters con pies y zipper doble via, diseño de conejito color lila para niña", que_es: "Pijama para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/pijama-carters-con-pies-y-zipper-doble-via-diseno-de-conejito-color-lila-para-nina-8872861.webp?v=1770946334&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/carters-1s946810" },
  { tienda: "Kinder", nombre_corto: "Toallitas 12-pack", nombre: "12PK Le Top de toallitas multicolor para niña", que_es: "Toallitas para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/12pk-le-top-de-toallitas-multicolor-para-nina-6908648.jpg?v=1774008246&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/le-top-dt1000005" },
  { tienda: "Kinder", nombre_corto: "Conjunto Falda Tutú", nombre: "Conjunto de 3 piezas Little Me blusa body , falda-tutu-leggins y banda para el cabello tulipanes", que_es: "Conjunto de ropa para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/conjunto-de-3-piezas-little-me-blusa-body-falda-tutu-leggins-y-banda-para-el-cabello-tulipanes-4987876.png?v=1774340555&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/little-me-lct17049n" },
  { tienda: "Kinder", nombre_corto: "Dispensador de Fruta", nombre: "Dispensador de Silicón para Comer Fruta, Rosado, 1-pack", que_es: "Dispensador de fruta para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/dispensador-de-silicon-para-comer-fruta-rosado-1-pack-9171594.jpg?v=1773345187&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dispensador-de-silicon-para-comer-fruta-rosado-1-pack" },
  { tienda: "Kinder", nombre_corto: "Baberos Bandana 5-pack", nombre: "Paquete de 5 baberos de bandana Baby Gear floral rosado niña", que_es: "Baberos para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/paquete-de-5-baberos-de-bandana-baby-gear-floral-rosado-nina-4772991.png?v=1778693115&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/baby-gear-eb1000004" },
  { tienda: "Kinder", nombre_corto: "Bolsas Leche Materna", nombre: "Bolsas para Almacenar Leche Materna, 100 unidades", que_es: "Bolsas para almacenar leche materna", url_imagen: "https://kinder.com.gt/cdn/shop/files/bolsas-para-almacenar-leche-materna-100-unidades-8745761.webp?v=1773345187&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/bolsas-para-almacenar-leche-materna-100-unidades" },
  { tienda: "Kinder", nombre_corto: "Cepillo para Pachas Lila", nombre: "Dr. Brown's - Cepillo para lavar pachas color lila", que_es: "Cepillo para lavar pachas", url_imagen: "https://kinder.com.gt/cdn/shop/files/dr-browns-cepillo-para-lavar-pachas-color-lila-4563946.jpg?v=1773345185&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-cepillo-para-lavar-pachas-color-lila" },
  { tienda: "Kinder", nombre_corto: "Extractor de Leche", nombre: "DR BROWN - Extractor de leche de una sola pieza", que_es: "Extractor de leche", url_imagen: "https://kinder.com.gt/cdn/shop/files/dr-brown-extractor-de-leche-de-una-sola-pieza-4615859.jpg?v=1773345606&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/dr-browns-bf015" },
  { tienda: "Kinder", nombre_corto: "Baberos Bandana 5-pack", nombre: "5PK de baberos Kyle & Deena estilo bandana multicolor para niña", que_es: "Baberos para bebé", url_imagen: "https://kinder.com.gt/cdn/shop/files/5pk-de-baberos-kyle-deena-estilo-bandana-multicolor-para-nina-6416592.jpg?v=1770741127&width=480", url_elemento: "https://kinder.com.gt/collections/baby-shower-4479/products/kyle-deena-ek1000034" },
];

async function main() {
  // Insert all items
  let inserted = 0;
  for (const item of items) {
    const result = await sql`
      INSERT INTO items (tienda, nombre_corto, nombre, que_es, url_imagen, url_elemento, estado)
      VALUES (${item.tienda}, ${item.nombre_corto}, ${item.nombre}, ${item.que_es}, ${item.url_imagen}, ${item.url_elemento}, 'disponible')
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    inserted += result.length;
  }

  console.log(`Inserted ${inserted} of ${items.length} items`);

  // Verify
  const count = await sql`SELECT COUNT(*)::int AS count FROM items`;
  console.log(`Total items in database: ${count[0].count}`);

  // Show first 3
  const sample = await sql`SELECT id, nombre, estado FROM items LIMIT 3`;
  for (const row of sample) {
    console.log(`  #${row.id}: ${row.nombre} [${row.estado}]`);
  }
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
