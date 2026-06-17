# Requirements

This file is the explicit capability and coverage contract for the project.

Use it to track what is actively in scope, what has been validated by completed work, what is intentionally deferred, and what is explicitly out of scope.

Guidelines:
- Keep requirements capability-oriented, not a giant feature wishlist.
- Requirements should be atomic, testable, and stated in plain language.
- Every **Active** requirement should be mapped to a slice, deferred, blocked with reason, or moved out of scope.
- Each requirement should have one accountable primary owner and may have supporting slices.
- Research may suggest requirements, but research does not silently make them binding.
- Validation means the requirement was actually proven by completed work and verification, not just discussed.

## Active

### R001 — Landing page with welcome and catalog entry
- Class: primary-user-loop
- Status: active
- Description: Pantalla de inicio con bienvenida cálida a Natalia, tema de abejas, y un botón grande "Ver catálogo de regalos". Mobile-first, responsive.
- Why it matters: Es la puerta de entrada; establece el tono del sitio y dirige al catálogo.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R002 — Gift catalog in card grid
- Class: core-capability
- Status: active
- Description: Catálogo en cuadrícula responsive de tarjetas. Cada tarjeta muestra: imagen del producto, nombre, descripción corta (qué_es), etiqueta de estado "Disponible" o "Apartado", botón "Yo lo regalo" (solo si disponible), enlace "Ver en la tienda". Filtro "Disponibles" / "Todos".
- Why it matters: Es la funcionalidad central — los invitados exploran y eligen qué regalar.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R003 — Atomic gift reservation with name capture
- Class: core-capability
- Status: active
- Description: Modal o pantalla para reservar: muestra imagen y nombre del producto, campo de texto "Tu nombre", botón "Confirmar que lo regalaré". Usa UPDATE condicional atómico (`WHERE estado = 'disponible'`). Si ya fue apartado, muestra mensaje de error y refresca.
- Why it matters: Previene que dos invitados compren el mismo regalo. Es la razón de ser del sitio.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R004 — Confirmation screen with store redirect
- Class: primary-user-loop
- Status: active
- Description: Pantalla de confirmación con mensaje de agradecimiento cálido (tono de abejas), botón principal "Ir a la tienda para comprarlo" (link externo al producto), botón secundario "Volver al catálogo".
- Why it matters: Cierra el flujo del invitado con una experiencia positiva y lo lleva a completar la compra.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R005 — Mobile-first responsive design with bee theme
- Class: quality-attribute
- Status: active
- Description: Diseño mobile-first, totalmente legible en celular y limpio en escritorio. Tema de abejas, panales y miel. Paleta pastel (amarillo claro #ffb300, beige, crema). Estilo redondeado, amigable, con espacio en blanco. Tipografía cálida (Quicksand + Open Sans). Íconos o ilustraciones sutiles de abejas.
- Why it matters: La mayoría de invitados abrirán el link en el celular. El tema visual es parte central de la experiencia.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R006 — Database seed from Notion catalog
- Class: integration
- Status: active
- Description: Poblar la tabla `items` en Neon Postgres con los ~32 artículos desde la base de datos de Notion (campos: Nombre → nombre, Qué es → que_es, URL de la imagen → url_imagen, URL del elemento → url_elemento). Todos inician con estado 'disponible'.
- Why it matters: Sin datos reales el catálogo está vacío. El seed debe ser automatizado desde la fuente de verdad (Notion).
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R007 — Production deployment on Vercel
- Class: launchability
- Status: active
- Description: Sitio desplegado en Vercel bajo subdominio gratuito (ej. dulce-espera-natalia.vercel.app). Conectado a Neon Postgres mediante variables de entorno configuradas en Vercel.
- Why it matters: El sitio debe ser accesible públicamente para los invitados.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R008 — Clear per-item availability status
- Class: core-capability
- Status: active
- Description: Cada artículo muestra claramente si está "Disponible" o "Apartado". El estado es global (viene de la BD, no del navegador) y se actualiza en tiempo real para todos los invitados.
- Why it matters: Los invitados necesitan saber instantáneamente qué regalos ya fueron tomados.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R009 — Multi-store catalog design
- Class: constraint
- Status: active
- Description: El diseño del catálogo no debe asumir una sola tienda. Actualmente todos los items son de Kinder, pero se pueden agregar productos de otras tiendas sin cambios de diseño.
- Why it matters: Evita acoplar el catálogo a una tienda específica.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

### R010 — Spanish copy with warm, festive tone
- Class: quality-attribute
- Status: active
- Description: Todos los textos en español, con tono cercano, alegre y agradecido. Nada corporativo ni frío.
- Why it matters: La audiencia es hispanohablante; el tono refuerza la experiencia del baby shower.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped

## Out of Scope

### R030 — User authentication or account creation
- Class: anti-feature
- Status: out-of-scope
- Description: No se requiere registro, login, ni creación de cuenta. Solo se captura el nombre al reservar.
- Why it matters: Elimina fricción para los invitados. Scope boundary explícita.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a

### R031 — Admin dashboard or management UI
- Class: admin/support
- Status: out-of-scope
- Description: No se construye vista de administración. La consulta de quién apartó qué se hace directamente sobre la BD con ayuda del agente.
- Why it matters: Simplifica el alcance. Los papás (2 personas) no necesitan una UI dedicada.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a

### R032 — Email notifications
- Class: admin/support
- Status: out-of-scope
- Description: No se envían correos al reservar ni al ser apartado un regalo.
- Why it matters: Mantiene el alcance mínimo viable.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | primary-user-loop | active | none yet | none | unmapped |
| R002 | core-capability | active | none yet | none | unmapped |
| R003 | core-capability | active | none yet | none | unmapped |
| R004 | primary-user-loop | active | none yet | none | unmapped |
| R005 | quality-attribute | active | none yet | none | unmapped |
| R006 | integration | active | none yet | none | unmapped |
| R007 | launchability | active | none yet | none | unmapped |
| R008 | core-capability | active | none yet | none | unmapped |
| R009 | constraint | active | none yet | none | unmapped |
| R010 | quality-attribute | active | none yet | none | unmapped |
| R030 | anti-feature | out-of-scope | none | none | n/a |
| R031 | admin/support | out-of-scope | none | none | n/a |
| R032 | admin/support | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 10
- Mapped to slices: 0
- Validated: 0
- Unmapped active requirements: 10
