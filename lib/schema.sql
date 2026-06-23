CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  que_es TEXT,
  url_imagen TEXT,
  url_elemento TEXT,
  estado TEXT NOT NULL DEFAULT 'disponible',
  tienda TEXT,
  nombre_corto TEXT,
  reservado_por TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  prioridad INTEGER,
  max_reservas INTEGER,
  precio_q DECIMAL(10,2),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
