# Project

## What This Is

Sitio web de lista de regalos (gift registry) para el baby shower de Natalia Juárez. Los invitados navegan un catálogo de regalos, reservan el que van a comprar (escribiendo su nombre), y son redirigidos a la tienda para completar la compra. La reserva es atómica para que dos personas no aparten el mismo artículo.

Tema visual: "Little Honey Bee" — abejas, panales y miel, paleta pastel (amarillo claro `#ffb300`, beige, crema), estilo tierno y redondeado.

## Core Value

Un invitado puede apartar un regalo de forma atómica escribiendo su nombre, sin crear cuenta ni iniciar sesión, y el estado queda visible para todos los demás invitados en tiempo real.

## Project Shape

- **Complexity:** complex
- **Why:** Aplicación web multi-pantalla con base de datos, operaciones atómicas, seed desde fuente externa (Notion), y despliegue en producción. Varias integraciones externas (Neon, Vercel, Google Fonts).

## Current State

- Diseños base generados por Google Stitch (4 pantallas HTML estáticas con Tailwind CDN) en `stitch-source/stitch_dulce_espera_de_natalia/`
- Catálogo de ~32 artículos extraído de Notion (base de datos `800c9949-80ec-445e-ae83-3fd8631cd10d`)
- Brief completo leído desde Notion (página "Brief para Google Stitch · Sitio Baby Shower de Natalia")
- Repositorio inicializado en `github.com/k-juarez/baby-shower.git`
- Nada desplegado aún

## Architecture / Key Patterns

- **Stack:** Next.js (App Router), Neon (Postgres serverless), Tailwind CSS, desplegado en Vercel
- **Sin autenticación:** Solo se captura nombre del invitado al reservar
- **Reserva atómica:** `UPDATE items SET estado = 'apartado', reservado_por = $nombre WHERE id = $id AND estado = 'disponible' RETURNING id`
- **Modelo de datos:** Tabla `items` con columnas: id, nombre, que_es, url_imagen, url_elemento, estado, reservado_por, creado_en
- **Diseño multi-tienda:** El catálogo no asume una sola tienda; actualmente todos los items son de Kinder pero pueden agregarse de otras
- **4 pantallas:** Inicio, Catálogo, Reservar (modal), Confirmación
- **Sin vista admin:** La consulta de reservas se hace directamente sobre la BD con ayuda del agente

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: Catálogo de regalos con reserva atómica — Sitio completo con catálogo, reserva, seed desde Notion, y despliegue en Vercel
