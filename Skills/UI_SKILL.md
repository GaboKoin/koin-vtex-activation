# UI_SKILL.md — Sistema de diseño del portal Koin

Leer antes de construir o modificar cualquier componente visual del portal.

---

## 1. Stack de UI

- **Framework:** React (Vite)
- **Componentes:** Untitled UI React — https://www.untitledui.com/react/components
- **Tema base:** https://github.com/otomendes/keystone-vibe — clonar y usar, no partir de cero
- **Estilos:** Tailwind CSS (incluido en Untitled UI)
- **Tipografía:** Inter
- **Iconos:** Untitled UI Icons

Antes de crear un componente custom, verificar si existe en Untitled UI. Si existe, usar ese.

---

## 2. Colores — Koin Keystone Design System

Fuente: PDF "Colors — KEYSTONE UI kit © 2024 KOIN". No inventar colores fuera de esta paleta.

### Gray
```
25: #FCFCFD   50: #F9FAFB   100: #F2F4F7   200: #EAECF0   300: #D0D5DD
400: #98A2B3  500: #667085  600: #475467   700: #344054   800: #182230
900: #101828  950: #0C111D
```

### Brand (verde Koin)
```
brand-600:   #10B132   ← acento principal
brand-light: #F6FEF9   ← fondos estados activos
brand-mid:   #DCFAE6   ← bordes suaves estados activos
brand-dark:  #067647   ← texto sobre fondos brand claros
```

### Semánticos
```
success-50: #ECFDF3   success-600: #079455   success-700: #067647
error-50:   #FEF3F2   error-600:   #D92D20
warning-50: #FFFAEB   warning-600: #DC6803
```

### Aplicación
| Elemento | Color |
|---|---|
| Fondo de página | gray-50 `#F9FAFB` |
| Superficies (cards, sidebar, topbar) | white |
| Bordes default | gray-200 `#EAECF0` |
| Bordes hover | gray-300 |
| Texto principal | gray-900 |
| Texto secundario | gray-500 / gray-600 |
| Placeholder | gray-400 |
| Acento / interactivo | brand-600 `#10B132` |
| Nav activo — fondo | brand-light |
| Nav activo — texto / borde izq | brand-600 |

---

## 3. Layout general del portal

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR                                                  │
│  breadcrumb (izq)              progreso global (der)     │
├─────────────┬───────────────────────────────────────────┤
│             │  BARRA DE PROGRESO GLOBAL (ancho completo) │
│  SIDEBAR    ├───────────────────────────────────────────┤
│  240px      │                                           │
│  fixed      │  CONTENT AREA                             │
│             │  padding 24px, fondo gray-50              │
│             │  scroll vertical                          │
└─────────────┴───────────────────────────────────────────┘
```

### Barra de progreso global — OBLIGATORIA

Va fija debajo del topbar, **a lo ancho de todo el content area** (no del sidebar).
Muestra el porcentaje de completitud del onboarding completo.

```
[░░░░░░░░░░░░░░░░░░░░░░░░]  0% completado
[████████████░░░░░░░░░░░░]  50% completado
[████████████████████████]  100% completado
```

Especificaciones:
- Altura: 6px
- Fondo: gray-100
- Relleno: brand-600 `#10B132`
- Border-radius: 0 (va pegada al borde del topbar, sin radius)
- A la derecha del relleno, mostrar el porcentaje como texto: `X% completado`
  - Font-size: 12px, color gray-500, weight 500
  - Posicionado arriba de la barra, alineado a la izquierda
- Transición suave: `transition: width 0.6s ease`

Cálculo del porcentaje:
- Onboarding con **8 pasos** en el portal: cada paso completo suma **12,5%** (100 ÷ 8).
- La barra global refleja solo esos pasos (no desglosar sub-pasos del chat dentro del porcentaje global).

### Sidebar — contenido exacto (8 pasos)
```
[Logo Koin]  "Onboarding clientes"

  1  Alta como cliente              [badge]
  2  Comercios                      [badge]
  3  Información del negocio        [badge]
  4  Revisión manual                [badge]
  5  Consentimiento del speech     [badge]
  6  Usuarios                       [badge]
  7  Marca                          [badge]
  8  Estrategias                   [badge]

── DOCUMENTACIÓN ──
  "Los manuales viven en el repo:
   docs/ y manuals/"

── Sesión ──
  [nombre cliente]
  [email]
```

### Topbar — contenido exacto
```
Izq: "Onboarding / Paso N — Nombre"
Der: "Progreso global   X de 8 pasos completos"
```

---

## 4. Paso 8 — Estrategias (chat)

El **paso 8** tiene 3 niveles de navegación (selector de estrategia → canal → chat):

### Nivel 1 — Selector de estrategia

El cliente ve solo las estrategias que contrató, como cards seleccionables.
Cada card: nombre, descripción breve, badge de estado.

Estrategias posibles (mostrar solo las contratadas):
- Validación de identidad (liveness + docscan)
- Token (mail + WhatsApp)
- Passkey
- Magic Link
- 3DS

### Nivel 2 — Selector de canal

El cliente elige la plataforma de su tienda: VTEX / Magento / API directa.
Canales sin flujo documentado → empty state: "Próximamente disponible".

### Nivel 3 — Chat guiado

Layout de dos columnas. **El chat debe ocupar todo el espacio disponible verticalmente** — es la pantalla principal cuando el usuario está en este nivel, no puede verse chico.

```
┌──────────────────────────────────────┬──────────────────────┐
│  CHAT  (flex: 1, height: 100%)       │  PANEL  (320px)      │
│                                      │                      │
│  ┌─ Header: avatar + estado ────────┐│  ┌─ Progreso ───────┐│
│  ├─ Barra progreso del flujo ───────┤│  │  sub-paso activo  ││
│  │                                  ││  │  resaltado verde  ││
│  │   área de mensajes               ││  └──────────────────┘│
│  │   (flex: 1, overflow-y: auto)    ││  ┌─ Documentos ─────┐│
│  │                                  ││  │  PDF + MD links   ││
│  ├─ Botones de opciones ────────────┤│  └──────────────────┘│
│  └─ Input + Enviar ────────────────┘│                      │
└──────────────────────────────────────┴──────────────────────┘
```

**Altura del chat:** el componente de chat debe llenar el viewport disponible.
Usar `height: calc(100vh - [altura topbar] - [altura barra progreso] - [padding])`.
El área de mensajes crece con `flex: 1` y tiene `overflow-y: auto`.
No dejar espacio muerto debajo del chat.

**Barra de progreso del flujo** (dentro del chat, entre header y mensajes):
- Altura: 4px
- Fondo: gray-100
- Relleno: brand-600
- Avanza con cada sub-paso completado en la conversación
- Sin texto adicional (es más pequeña que la barra global)

**Panel lateral — Progreso del paso:**
- Sub-paso activo: número en círculo brand-600 relleno + borde brand-600 en la card + fondo brand-light
- Sub-pasos completados: check en círculo success-600 + texto tachado suave
- Sub-pasos pendientes: número en círculo gray-200

**Panel lateral — Documentos:**
- Apuntar a archivos reales del repo (en deploy suelen copiarse bajo `public/` vía `portal/scripts/ensurePublicAssets.mjs`)
- Para validación de identidad / VTEX:
  - `manuals/v1.0.0_validacion_identidad_vtex_gtm.pdf` → "Descargar PDF →"
  - `docs/08_estrategias/validacion_identidad/troubleshooting_vtex.md` → "Abrir en pestaña nueva →" (URL pública típica: `/docs/08_estrategias/validacion_identidad/troubleshooting_vtex.md`)

---

## 5. Estados de pasos en el sidebar

| Estado | Visual número | Badge |
|---|---|---|
| Pendiente | círculo gray-200, número gray-400 | "Pendiente" gray-100/400 |
| En progreso | círculo brand-600, número white | "En progreso" brand-light/600 |
| Completado | círculo success-50, check success-600 | "Listo" success-50/600 |

Item activo: `background brand-light`, `border-left 2px solid brand-600`.

---

## 6. Chat — estilo visual (tema claro, siempre)

El portal usa tema claro. El tema oscuro de versiones anteriores está descartado.

| Elemento | Valor |
|---|---|
| Fondo mensajes | gray-50 |
| Burbuja bot | white, border gray-200, shadow-sm, radius 4px 12px 12px 12px |
| Burbuja usuario | gray-900 bg, white text, radius 12px 4px 12px 12px |
| Avatar bot | gray-900 bg, brand-600 text, border-radius 8px |
| Avatar usuario | iniciales, brand-light bg, brand-600 text |
| Botón primario | gray-900 bg, white text |
| Botones secundarios | white bg, gray-300 border, gray-600 text |
| Input | border gray-300, focus: border brand-600 + ring rgba(16,177,50,0.12) |
| Botón Enviar | bg brand-600 `#10B132`, white text |
| Caja tip | border-left 2px brand-600, bg rgba(16,177,50,0.05) |
| Caja warning | border-left 2px warning-600, bg warning-50 |
| Caja ok | border-left 2px success-600, bg success-50 |
| Código | bg gray-900, text brand-600, font mono, border-left 3px brand-600 |

Contenido y comportamiento: seguir `CHATBOT_SKILL.md` sin excepción.

---

## 7. Componentes Untitled UI a usar

| Componente | Untitled UI | Dónde |
|---|---|---|
| Sidebar | `sidebar-navigations` | Layout global |
| Page header | `page-headers` | Cada paso |
| Progress bar | `progress-indicators` | Barra global + barra del flujo |
| Cards seleccionables | `radio-groups` | Selector estrategia y canal (paso 8) |
| Form inputs | `inputs` | Pasos con formularios (1, 3, 4, …) |
| File uploader | `file-uploaders` | Pasos con archivos (1 constancia, 7 marca) |
| Tablas editables / toggles | `tables` / `toggles` | Pasos 2 (comercios), 6 (usuarios) |
| Progress steps | `progress-steps` | Panel lateral del chat (paso 8) |
| Badges | `badges` | Estados |
| Alerts | `alerts` | Tips/warnings en chat |
| Chat | `messaging` | Paso 8 |
| Code snippets | `code-snippets` | Scripts en chat |
| Empty states | `empty-states` | Canales/estrategias pendientes |

---

## 8. Tipografía

| Uso | Peso | Tamaño |
|---|---|---|
| Títulos de página | 600 | 20px |
| Títulos de sección | 600 | 14px |
| Labels | 500 | 12px |
| Cuerpo | 400 | 14px |
| Texto secundario | 400 | 13px |
| Badges | 500 | 11–12px |
| Código | 400 | 12px mono |

---

## 9. Sombras y bordes

```
shadow-sm:    0 1px 2px rgba(16,24,40,0.05)
shadow-md:    0 4px 8px -2px rgba(16,24,40,0.1)
border:       1px solid #EAECF0
focus:        border brand-600 + ring rgba(16,177,50,0.12)
radius:       sm=6  md=8  lg=12  xl=16  full=9999  (px)
```

---

## 10. Descartado — no usar

- Tema oscuro (`#0a0a0a`, `#111`, `#39ff14`) — solo en bloques de código
- HTML vanilla sin React
- Estilos fuera de la paleta Keystone
- Chat que no ocupa el viewport completo disponible

---

## 11. Checklist antes de deploy

- [ ] Barra de progreso global visible debajo del topbar con % correcto (8 pasos × 12,5%)
- [ ] Chat ocupa todo el alto disponible del viewport (no se ve chico) cuando el paso 8 está en VTEX
- [ ] Paso 8 muestra: selector estrategia → selector canal → chat
- [ ] Solo se muestran estrategias contratadas
- [ ] Sub-paso activo resaltado en el panel lateral del chat
- [ ] Documentos del panel apuntan a archivos reales del repo (`08_estrategias`, `manuals/`)
- [ ] Pasos 1–7 funcionales según SPECs (formularios, tablas, marca, etc.)
- [ ] Sidebar con 8 ítems, refleja estado real, badges actualizados
- [ ] Chat en tema claro (sección 6)
- [ ] Responsive
- [ ] Checklist de `CHATBOT_SKILL.md` sección 9 pasado
