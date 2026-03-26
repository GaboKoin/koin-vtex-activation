# SYNTHETIC_USERS_SKILL.md — Identidades sintéticas para testing de productos

Usar este skill cada vez que se quiera simular cómo usuarios reales de merchants
de ecommerce interactuarían con un producto, feature o herramienta de Koin.

---

## 1. Para qué sirve

Genera cohortes de usuarios sintéticos que representan los contactos reales
de los merchants de Koin. Cada usuario tiene un perfil, un contexto y una
forma de pensar distinta. El objetivo es detectar problemas, fricciones y
oportunidades de mejora antes de llegar a usuarios reales.

Resultado siempre: un **reporte HTML self-contained** guardado en `reports/`,
con gráficas, KPIs en fracción **X/N**, hallazgos enriquecidos y próximos pasos
expandibles. Referencia visual: `reports/templates/synthetic-report-v2.html`.

---

## 2. Modos de test

| Modo | Usuarios | Por rol | Cuándo usarlo |
|------|----------|---------|---------------|
| **Rápido** | 10 | 2 | Validar si algo está roto. Decisiones en el día. |
| **Completo** | 25 | 5 | Flujo nuevo o cambio significativo. Estándar del proyecto. |
| **A/B** | 30 | 3 × versión | Comparar dos versiones de un mismo flujo. |

**Default para este proyecto: Completo (25 usuarios, 5 por rol).**

---

## 3. Los 5 roles

### Rol 1 — Comercial / Account Manager
**Perfil:** Primer contacto del merchant con Koin. Conoce el negocio
del cliente pero sin profundidad técnica. Foco en velocidad y satisfacción.

**Motivaciones:** Cerrar el onboarding rápido. Que el cliente no lo llame
con problemas. Que todo sea claro sin necesitar explicaciones.

**Frustraciones típicas:** Terminología técnica sin explicación. Pasos que
requieren involucrar a IT. Falta de visibilidad del progreso.

**Cómo interactúa:** Escanea rápido. Si algo no es obvio en 10 segundos,
llama a soporte. Prefiere botones a texto libre.

**Nivel técnico:** Bajo | **Paciencia con errores:** Baja | **Foco:** Velocidad y claridad

---

### Rol 2 — Project Manager / Onboarding
**Perfil:** Coordina la integración del lado del merchant. Visión general
del proceso, maneja múltiples stakeholders internos.

**Motivaciones:** Claridad total sobre pasos, tiempos y responsables.
Poder reportar internamente el avance sin quedar mal.

**Frustraciones típicas:** No saber en qué paso están ni cuánto falta.
Información inconsistente entre lo que dijo Koin y el portal.

**Cómo interactúa:** Lee todo. Busca el mapa completo antes de empezar.
Valora el progreso visible. Toma notas y vuelve varias veces.

**Nivel técnico:** Medio | **Paciencia con errores:** Media | **Foco:** Control y visibilidad

---

### Rol 3 — Operaciones / Backoffice
**Perfil:** Trabaja con los sistemas del día a día. Es quien va a usar
el portal de Koin operativamente.

**Motivaciones:** Procesos consistentes y repetibles. Sin sorpresas.
No tener que improvisar.

**Frustraciones típicas:** Términos que no coinciden con los que usa
internamente. Pasos que dependen de información que no tiene a mano.

**Cómo interactúa:** Metódico. Sigue los pasos en orden. Si algo falla,
busca el error exacto antes de escalar.

**Nivel técnico:** Medio | **Paciencia con errores:** Media-alta | **Foco:** Consistencia y precisión

---

### Rol 4 — Producto / UX
**Perfil:** Evalúa la experiencia del producto. Tiene criterio de diseño
y UX. Compara con Stripe, Shopify, Intercom.

**Motivaciones:** Experiencia coherente y bien pensada. Diseño que
comunique sin inconsistencias.

**Frustraciones típicas:** Inconsistencias visuales. Textos ambiguos.
Falta de feedback visual. Flujos sin lógica.

**Cómo interactúa:** Analítico. Nota detalles pequeños. Propone
alternativas. Feedback largo y estructurado.

**Nivel técnico:** Medio-alto | **Paciencia con errores:** Baja (los documenta todos) | **Foco:** Experiencia y coherencia

---

### Rol 5 — Técnico / Desarrollador
**Perfil:** Ejecuta la integración técnica. Prefiere documentación
clara y código a explicaciones de negocio.

**Motivaciones:** Documentación precisa. Errores con mensajes
descriptivos. Poder probar sin romper producción.

**Frustraciones típicas:** Documentación desactualizada. Mensajes de
error genéricos. Mezcla de config de negocio con config técnica.

**Cómo interactúa:** Va directo al grano. Lee la doc técnica primero.
Prueba los límites. Reporta bugs con precisión.

**Nivel técnico:** Alto | **Paciencia con errores:** Alta (técnicos), baja (UX) | **Foco:** Precisión y autonomía

---

## 4. Variaciones dentro de cada rol (modo Completo — 5 por rol)

| Usuario | Experiencia SaaS | Tamaño merchant | Urgencia |
|---------|-----------------|-----------------|----------|
| A | Novato | Mediano | Alta |
| B | Intermedio | Grande | Media |
| C | Experto | Pequeño | Baja |
| D | Intermedio | Grande | Alta |
| E | Novato | Grande | Media |

---

## 5. Gráficas obligatorias en el reporte

Todas generadas con **Chart.js** (CDN) en el HTML. Colores base: completaron `#10B132`, abandonaron `#D92D20`, fricciones por rol con **color por barra** (paleta distinta por rol para lectura rápida).

### Gráfica 1 — Tasa de completitud por rol
Barras **apiladas**: verde = completaron, rojo = abandonaron. Eje Y acotado al tamaño de cohorte por rol (p. ej. máx. 5 en modo Completo). Leyenda inferior clara.

### Gráfica 2 — Fricciones detectadas por rol
Barras verticales; **un color por rol** (no un solo gris) para comparar de un vistazo.

### Gráfica 3 — Distribución de hallazgos por severidad
Donut: CRÍTICO / ALTO / MEDIO / BAJO. Los conteos deben coincidir con el **número total de hallazgos documentados** en `REPORT_DATA.findings`.

### Gráfica 4 — Matriz esfuerzo × impacto
Scatter: eje X esfuerzo (1 = bajo, 3 = alto), eje Y impacto (1–5). Quick wins (`quickWin: true`) en verde; tooltips con nombre del hallazgo.

---

## 6. Formato del reporte HTML — cómo generarlo

### Proceso (simple, un solo paso)

1. Leer `reports/templates/synthetic-report-v2.html` como **referencia de estructura** (CSS, JS de render, layout).
2. Generar `REPORT_DATA` (el JSON con todos los datos del test).
3. Escribir **un HTML self-contained** en `reports/AAAA-MM-DD_[producto].html` con el JSON embebido dentro de `<script type="application/json" id="report-data-json">`.
4. Listo.

**No hay pipeline de build, no hay JSON intermedio, no hay scripts de Node.**
El HTML se escribe directamente con la herramienta Write de Cursor.

### Nombres de archivo

| Situación | Patrón |
|-----------|--------|
| Entrega estándar | `AAAA-MM-DD_[producto].html` |
| Nueva iteración | `AAAA-MM-DD_[producto]_iteracion2.html` |

### Portada
- Kicker: **Koin — Testing sintético** (tono hero, legible).
- Título del producto (ej. *Chatbot de onboarding — Activación VTEX*).
- **Pregunta clave** como subtítulo destacado (contraste alto, `#7dd3fc`).
- **Píldoras meta:** Fecha, Modo/cohorte, Producto, URL del entorno.

### Barra de documento
Una fila: producto, URL, clasificación, referencia.

### Franja KPI (cuatro celdas)
- **Completaron** y **Abandonaron** como **X/N** (N = tamaño cohorte).
- **Fricciones:** total agregado.
- **Hallazgos:** total detectado + subtítulo *Top K en §03 (matriz)*.
- Código de color: verde / rojo / ámbar / púrpura con **barra inferior** por celda.

### Resumen ejecutivo (§01)
Texto corto y escaneable: 1 párrafo + viñetas *Qué funciona / Dónde falla / Implicancia*. Sin bloques densos.

### Análisis visual (§02)
Las 4 gráficas con título, subtítulo, canvas, pie de figura.

### Hallazgos priorizados — Top (§03)
Seleccionar **K** hallazgos (típico 5–8, configurable en `meta.topLimit`) por **score `impact / effort`** (effort mín. 0.5). Desempate: severidad. Nota explícita: *Top por matriz; total de hallazgos: N*.

Ficha por hallazgo: ID, título, severidad, roles afectados, frecuencia (affected/denominator + label), descripción, cita (bloque resaltado), cambio sugerido, impacto en negocio, criterios de aceptación, contenido sugerido (opcional).

### Análisis por rol (§04)
Cards rojo/verde/gris: Fricciones (fondo `#FEF3F2`, borde `#D92D20`), Qué funcionó (fondo `#ECFDF3`, borde `#10B132`), Prioridad (fondo `#F9FAFB`, border-top).

### Tabla cohorte (§05)
Cabecera oscura, filas alternadas: ID, Rol, Variación, Resultado, Paso máx., Fricciones.

### Próximos pasos (§06)
**Todos** los hallazgos en orden de roadmap: impacto ↓, esfuerzo ↑, severidad ↓. Cada fila: texto + badge esfuerzo + **Ver más** (`<details>`) con la misma ficha de §03.

### Esquema `REPORT_DATA` (obligatorio)

```
{
  meta: { pageTitle, ref, coverKicker, productTitle, keyQuestion, dateLabel, modeLabel, productLabel, url, docClassification, cohortSize, topLimit, chartsIntro },
  summary: { lead, bullets: [{ title, items }] },
  charts: { roles, completaron, abandonaron, fricciones, frictionColors },
  findings: [{ id, title, severity, rolesAffected, frequency: { affected, denominator, label }, description, quote, suggestedChange, businessImpact, acceptanceCriteria, contentDraft, effort, impact, quickWin }],
  roleCards: [{ title, fricciones, ok, priority }],
  cohort: [[id, rol, variacion, resultado, paso, fricciones]]
}
```

### Tipografía y tema
- **Inter** — cuerpo y tablas.
- **DM Sans** — portada, KPIs, números de sección.
- Fondo `#F9FAFB`; paleta Keystone.

### Coherencia de datos
- `cohort` + arrays de gráficas 1–2 alineados (completaron + abandonaron = cohortSize/roles).
- Donut = conteo por severity sobre **todos** los findings.
- Verificación opcional: `node reports/verifySyntheticReport_v2.mjs [informe.html]`.

---

## 7. Dónde guardar el reporte

```
reports/
├── templates/synthetic-report-v2.html   ← referencia visual
├── verifySyntheticReport_v2.mjs         ← verificador (opcional)
└── AAAA-MM-DD_[producto].html           ← informes
```

Solo **`reports/`**. Documentar en CHANGELOG después de cada test.

---

## 8. Cómo invocar este skill

```
Usando SYNTHETIC_USERS_SKILL.md, hacer un test sintético de [producto].

Modo: Completo (25 usuarios, 5 por rol)
Producto: [descripción]
Contexto: [estado actual]
Pregunta clave: [qué queremos aprender]

Generar cohorte, simular interacción, escribir el HTML self-contained
en reports/ con REPORT_DATA embebido.
```

---

## 9. Reglas del reporte

- Usar la estructura de `reports/templates/synthetic-report-v2.html` como base.
- **Un solo archivo HTML** por informe. Sin JSONs intermedios, sin scripts de build.
- **§03 — Top:** K hallazgos por `impact / effort` (mín. 0.5), desempate severidad. `topLimit` en meta (típico 5–8).
- **§06:** todos los hallazgos en orden roadmap: impacto ↓, esfuerzo ↑, severidad ↓.
- Cada hallazgo con ficha completa (§6).
- Las 4 gráficas obligatorias (§5).
- KPIs como fracciones X/N con barras de color.
- Guardado solo en `reports/` con nombre y fecha.
- CHANGELOG actualizado después de cada test.

---

## 10. Informes históricos

Los HTML generados antes de la plantilla v2 se conservan como referencia; los nuevos usan v2.
