# Koin Onboarding — Estructura del proyecto

Portal web para automatizar el proceso de onboarding de clientes de Koin.
Reemplaza el flujo actual de mails + planillas de Google Sheets.

---

## Estructura de archivos

```
koin-onboarding/
│
├── README.md
├── skills/
│   ├── CHATBOT_SKILL.md
│   ├── UI_SKILL.md
│   └── DOCUMENTATION_SKILL.md
│
├── docs/
│   ├── CHANGELOG.md
│   ├── 01_alta_cliente/SPEC.md         ✅ campos definidos
│   ├── 02_comercios/SPEC.md            ✅ campos definidos
│   ├── 03_informacion_negocio/SPEC.md  ✅ campos definidos
│   ├── 04_revision_manual/SPEC.md      ✅ campos definidos
│   ├── 05_speech/SPEC.md               ✅ campos definidos
│   ├── 06_usuarios/SPEC.md             ✅ campos definidos
│   ├── 07_marca/SPEC.md                ✅ campos definidos
│   └── 08_estrategias/
│       └── validacion_identidad/
│           └── flujo_vtex.md           ✅ completo v1.0.0
│
├── manuals/
│   └── v1.0.0_validacion_identidad_vtex_gtm.pdf
│
└── portal/
    └── (código React)
```

---

## Pasos del onboarding — 8 pasos

| # | Paso | Tipo de UI | SPEC |
|---|------|-----------|------|
| 1 | Alta como cliente | Formulario | docs/01_alta_cliente/SPEC.md |
| 2 | Comercios | Tabla editable | docs/02_comercios/SPEC.md |
| 3 | Información del negocio | Formulario | docs/03_informacion_negocio/SPEC.md |
| 4 | Revisión manual | Formulario | docs/04_revision_manual/SPEC.md |
| 5 | Consentimiento del speech | Texto + checkbox | docs/05_speech/SPEC.md |
| 6 | Usuarios | Tabla con toggles | docs/06_usuarios/SPEC.md |
| 7 | Marca | File uploads | docs/07_marca/SPEC.md |
| 8 | Estrategias | Chat asistente | docs/08_estrategias/ |

---

## Estrategias (paso 8)

| Estrategia | VTEX | API | Magento |
|------------|------|-----|---------|
| Validación de identidad | ✅ v1.0.0 | Pendiente | Pendiente |
| Token (mail + WhatsApp) | Pendiente | Pendiente | Pendiente |
| Passkey | Pendiente | Pendiente | Pendiente |
| Magic Link | Pendiente | Pendiente | Pendiente |
| 3DS | Pendiente | Pendiente | Pendiente |

---

## Reglas clave

- **Solo para el cliente final** — no para el equipo interno de Koin
- **Speech y revisión manual** — el cliente completa el formulario de revisión manual
  y aprueba el speech. El equipo de Koin lo procesa internamente.
- **Datos compartidos entre pasos** — razón social y empresa del paso 1
  se reusan en pasos siguientes (readonly)
- **Estrategias por contrato** — mostrar solo las contratadas por el cliente
- **Progreso global** — cada paso completo = 12.5% (100/8)
