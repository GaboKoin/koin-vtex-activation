# DOCUMENTATION_SKILL.md — Cómo documentar en este proyecto

Leer antes de crear o modificar cualquier documento.

---

## 1.1 Estructura actual de `docs/` (referencia)

Mantener rutas alineadas al `README.md` del repo:

```
docs/
├── CHANGELOG.md
├── 01_alta_cliente/SPEC.md
├── 02_comercios/          (p. ej. spec.md)
├── 03_informacion_negocio/SPEC.md
├── 04_revision_manual/SPEC.md
├── 05_speech/SPEC.md
├── 06_usuarios/SPEC.md
├── 07_marca/SPEC.md
└── 08_estrategias/
    ├── SPEC.md
    ├── validacion_identidad/
    │   ├── flujo_vtex.md
    │   └── troubleshooting_vtex.md
    ├── vtex/
    ├── api/
    └── magento/
```

Los flujos técnicos de activación viven bajo **`docs/08_estrategias/`** (no usar `03_activacion/` ni `03_estrategias/` en documentación nueva).

---

## 1. Cuándo documentar

Siempre. Cada cambio al chatbot o al proceso de onboarding genera:
1. Una entrada en `docs/CHANGELOG.md`
2. Un `flujo.md` actualizado en la carpeta del módulo
3. Un manual PDF nuevo en `manuals/` si el cambio es significativo

---

## 2. Estructura de un flujo.md

```markdown
# Módulo XX — Nombre

## Flujo completo

### Prerequisitos
- Lista de lo que el usuario necesita antes de empezar

### Paso 1 — Nombre del paso
1. Acción concreta
2. Acción concreta

### Paso N — ...

## Estado: [ Pendiente | En progreso | ✅ Completo (vX.Y.Z) ]
```

---

## 3. Cómo generar un manual PDF

Pedirle al agente:

```
Generá un manual PDF para el módulo [nombre], versión [X.Y.Z].
Basate en docs/08_estrategias/[subcarpeta]/flujo.md (u otro SPEC/flujo bajo docs/) para el contenido.
Seguí el estilo visual de manuals/v1.0.0_validacion_identidad_vtex_gtm.pdf como referencia.
Guardarlo en manuals/vX.Y.Z_[nombre-del-modulo].pdf
Actualizar CHANGELOG.md con la nueva versión.
```

### Estructura del manual (siempre la misma)
1. Introducción
2. Requisitos previos
3. Pasos (uno por sección)
4. Publicación / verificación
5. Checklist de validación
6. Solución de problemas comunes
7. Anexos (scripts, URLs, credenciales de prueba)

### Convención de nombres
`vX.Y.Z_[descripcion-corta-en-minusculas].pdf`

---

## 4. Versionado

| Tipo | Cuándo | Ejemplo |
|------|--------|---------|
| vX.0.0 | Módulo nuevo completo | v2.0.0 |
| vX.Y.0 | Flujo nuevo dentro de un módulo | v1.1.0 |
| vX.Y.Z | Fix de texto, ajuste menor | v1.0.1 |

---

## 5. Template CHANGELOG entry

```markdown
## vX.Y.Z — AAAA-MM — Título

**Módulo:** ruta dentro de docs/

**Tipo:** [ ] Módulo nuevo  [ ] Flujo nuevo  [ ] Fix  [ ] Diseño

**Qué incluye:**
- ...

**Archivos:**
- ...

**Fuente:** (manual PDF / instrucciones del equipo / feedback)
```
