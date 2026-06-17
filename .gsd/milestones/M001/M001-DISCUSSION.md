# M001 Discussion Log

## Exchange — 2026-06-17T21:49:27.429Z

### Vista Admin

¿Cómo protegemos la vista de administración (quién apartó qué) si no hay login?

- **URL con token secreto (Recommended)** — Ruta tipo /admin?token=algo-largo-imposible-de-adivinar. Simple, sin backend de auth, suficiente para 1-2 personas.
- **Contraseña simple en el front** — Prompt que pide una contraseña antes de mostrar los datos. Menos segura si alguien mira el source, pero más amigable.

**Selected:** None of the above
**Notes:** No tendremos vista de administrador. Añadiremos la información directamente con tu ayuda.

### Dominio

¿Querés un dominio personalizado o usamos el subdominio gratuito de Vercel?

- **Subdominio de Vercel (Recommended)** — Algo como dulce-espera-natalia.vercel.app. Cero costo, cero configuración DNS.
- **Dominio personalizado** — Comprás un dominio (o ya tenés uno) y lo configuramos en Vercel.

**Selected:** Subdominio de Vercel (Recommended)
---

