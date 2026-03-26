# CHATBOT_SKILL.md — Reglas permanentes del chatbot Koin

Leer este archivo completo antes de escribir cualquier código o contenido del chatbot.
Aplica a todos los módulos del onboarding, no solo a VTEX.

---

## 1. Misión

El chatbot existe para que el usuario complete el paso que está intentando hacer.
Cada conversación es un éxito o un fracaso:
- **Éxito** → el usuario terminó el paso y lo dejó funcionando
- **Fracaso** → el usuario se fue sin terminar

No comunicar la misión al usuario. Es interna.

---

## 2. Tono y lenguaje

- Simple. Si se puede decir sin tecnicismo, así se dice.
- Directo. Sin introducciones largas.
- Amigable, no corporativo.
- Sin presión. No recordarle al usuario cuál es su objetivo.

**Nunca usar:**
- "Mi objetivo — y el tuyo — es..."
- "Como asistente de IA..."
- "¡Excelente pregunta!"
- "Por supuesto, con gusto..."

**Estructura de respuesta ideal:**
1. Respuesta directa a lo que preguntaron
2. Pasos numerados o steps visuales
3. Tip o advertencia si hace falta (no siempre)
4. Botones para continuar

---

## 3. Estructura de conversación

**Inicio:** mostrar siempre los pasos del módulo activo, numerados, con descripción corta. Preguntar por dónde empezar.

**Navegación:** botones predefinidos + texto libre. El primer botón siempre es el paso siguiente (primario/verde).

**Preguntas de contexto:** responder cualquier pregunta relacionada al proceso aunque no esté en el flujo principal. Nunca tirar al inicio cuando el usuario hace una pregunta de contexto. Mantener el progreso y volver al punto donde estaba.

**Fallback:** si no se entiende la intención, mantener el nodo actual y mostrar sus opciones. No resetear.

---

## 4. Progreso

- Barra de progreso en la parte superior, avanza con cada paso.
- Nodos `ctx_*` y `debug_*` no modifican el progreso.
- Al llegar a `fin`: barra al 100% + pantalla de éxito.

**Pantalla de éxito:**
- Overlay oscuro, check verde pulsante
- Título corto de celebración
- Una línea confirmando qué quedó activado
- Botón para cerrar

---

## 5. Manejo de errores

1. Identificar el síntoma específico
2. Pasos de diagnóstico del más simple al más complejo
3. Si no se resuelve → escalar a soporte con contexto claro

Errores comunes a cubrir en cualquier flujo:
- La configuración no se guardó
- El script se ejecuta en todas las páginas (falta filtro)
- El script está bloqueado por CSP
- Herramienta incorrecta conectada
- Diferencia entre staging y producción

---

## 6. Diseño visual

### Paleta
| Elemento | Valor |
|---|---|
| Fondo general | `#0a0a0a` |
| Superficie | `#111111` |
| Superficie secundaria | `#181818` |
| Bordes | `#252525` |
| Acento Koin | `#39ff14` |
| Acento dimmed | `#1a4a09` |
| Texto principal | `#f0f0f0` |
| Texto secundario | `#888888` |
| Texto terciario | `#555555` |

### Tipografía
- Display/UI: **Syne** (Google Fonts) — 400, 500, 700, 800
- Código: **DM Mono** (Google Fonts) — 400, 500

### Componentes

**Burbuja bot:** fondo `#111`, borde `1px solid #252525`, radius `3px 10px 10px 10px`

**Burbuja usuario:** fondo `#0d1f0d`, borde `rgba(57,255,20,0.2)`, texto `#c8f5b8`, radius `10px 3px 10px 10px`

**Step numerado:** círculo `20px, bg #1a4a09, color #39ff14`, fila `bg #181818, border #252525, radius 6px`

**Caja tip:** `border-left 2px #39ff14`, `bg rgba(57,255,20,0.04)`, texto `#888`

**Caja warning:** `border-left 2px #f59e0b`, `bg #1a1400`, texto `#c9a44a`

**Caja ok:** `border-left 2px #22c55e`, `bg #001a0d`, texto `#4ade80`

**Caja error:** `border-left 2px #ef4444`, `bg #1a0000`, texto `#f87171`

**Bloque código:** `bg #181818`, `border 1px #303030`, `border-left 3px #39ff14`, `font DM Mono`, `color #2dcc10`, `radius 0 8px 8px 0`

**Botón primario:** `bg #1a4a09`, `color #39ff14`, `border rgba(57,255,20,0.4)`, `radius 20px`, `font-weight 700`

**Botón secundario:** `bg transparent`, `color #888`, `border #303030`, hover: `border #39ff14, color #39ff14`

### Animaciones
- Mensajes: `fadeUp` 250ms (opacity 0→1, translateY 6px→0)
- Typing: 3 puntos verdes pulsantes
- Progress bar: `transition width 0.6s ease`
- Éxito: `ringPulse` — box-shadow verde respirando cada 2s

---

## 7. Estructura del KB

```js
nombre_nodo: {
  text: `HTML string`,
  opts: [{ l: 'Label botón', n: 'nodo_destino' }]
}
```

**Convenciones:**
- `welcome` → nodo inicial, muestra pasos del módulo activo
- `pasoN_*` → flujo principal
- `ctx_*` → preguntas de contexto (tienen botón de retorno, no avanzan progreso)
- `debug_*` → diagnóstico (no avanzan progreso)
- `fin` → dispara pantalla de éxito

---

## 8. handleText

1. `toLowerCase()` + `normalize('NFD').replace(/[\u0300-\u036f]/g, '')`
2. Preguntas de contexto **primero**
3. Regex con variaciones naturales del español
4. Sin match → mantener nodo actual, mensaje suave

---

## 9. Checklist antes de publicar

- [ ] Welcome muestra todos los pasos del módulo activo
- [ ] Cada paso tiene al menos un nodo `ctx_*`
- [ ] Existe al menos un nodo `debug_*` para el flujo
- [ ] `handleText` detecta preguntas del nuevo contenido
- [ ] `STEPS_PROGRESS` actualizado
- [ ] Barra llega a 100% solo en `fin`
- [ ] Pantalla de éxito confirma qué quedó activado
- [ ] Probado con preguntas en lenguaje natural
- [ ] `CHANGELOG.md` actualizado

---

## 10. Módulos del onboarding (referencia)

Los **pasos 1–7** del portal son formularios/tablas (sin KB de chat). El **chatbot aplica al paso 8 — Estrategias** (p. ej. validación de identidad + canal VTEX).

| Ámbito | Carpeta de docs | Notas |
|--------|-----------------|--------|
| Flujo VTEX (GTM) | `docs/08_estrategias/vtex/flujo.md` | También resumido en `docs/08_estrategias/validacion_identidad/flujo_vtex.md` |
| Troubleshooting VTEX | `docs/08_estrategias/validacion_identidad/troubleshooting_vtex.md` | Coherente con nodos `debug_*` del HTML |
| Activación API | `docs/08_estrategias/api/flujo.md` | Pendiente en portal |
| Activación Magento | `docs/08_estrategias/magento/flujo.md` | Pendiente en portal |
| SPECs portal (sin chat) | `docs/01_alta_cliente/`, `02_comercios/`, `03_informacion_negocio/`, `04_revision_manual/`, `05_speech/`, `06_usuarios/`, `07_marca/` | Ver `README.md` |

**Estado chatbot (VTEX / validación de identidad):** ✅ v1.0.0 — contenido en `chatbot/index.html`, alineado a los flujos anteriores.

Para agregar un módulo nuevo al chatbot, leer primero el `flujo.md` correspondiente bajo `docs/08_estrategias/`, luego crear los nodos siguiendo las reglas de este archivo.
