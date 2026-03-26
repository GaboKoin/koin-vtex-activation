# `reports/` — Informes de testing sintético

| Archivo | Descripción |
|---------|-------------|
| `templates/synthetic-report-v2.html` | **Plantilla de referencia (v2)** — CSS, Chart.js, render desde `REPORT_DATA`. No se usa como build; sirve de base visual para nuevos informes. |
| `verifySyntheticReport_v2.mjs` | Verificación opcional de informes v2 (cohorte, sumas gráficas, donut vs findings). Uso: `node reports/verifySyntheticReport_v2.mjs [informe.html]`. |

**Convención:** nuevos informes `AAAA-MM-DD_[producto].html` — un solo HTML self-contained con `REPORT_DATA` embebido. Ver `Skills/SYNTHETIC_USERS_SKILL.md` §6.
