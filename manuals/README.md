# Manuales PDF

Colocá aquí el PDF definitivo de configuración con el nombre:

`v1.0.0_validacion_identidad_vtex_gtm.pdf`

Si falta en el repo, `predev` / `prebuild` genera un PDF mínimo válido en `portal/public/manuals/` (`scripts/ensurePublicAssets.mjs` + `scripts/minimalManualPdf.js`). Así la URL del manual no devuelve el HTML del SPA (que el visor de PDF muestra “en blanco”).

En producción (Vercel), el rewrite del SPA ya no aplica a `/manuals/*`, `/docs/*` ni `/chatbot/*`.
