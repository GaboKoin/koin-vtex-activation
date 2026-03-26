# Módulo 03a — VTEX: solución de problemas

## Flujo completo

### Prerequisitos
- Haber seguido `flujo_vtex.md` (activación VTEX + GTM) o estar en diagnóstico con soporte.

### Paso 1 — Síntomas frecuentes (referencia)
1. La configuración no se guardó — volver a guardar en VTEX/GTM y verificar permisos.
2. El script se ejecuta en todas las páginas — revisar el activador en GTM (no usar "Todas las páginas" para el tag de Koin).
3. El script está bloqueado por CSP — permitir dominios de Koin (sandbox y/o producción) según corresponda.
4. Contenedor o tienda incorrecta — confirmar que el GTM-XXXXXX en VTEX coincide con el contenedor editado.
5. Diferencia entre staging y producción — usar script sandbox en pruebas y producción solo cuando corresponda.

Para guía conversacional alineada al chatbot, usá los nodos de depuración en `chatbot/index.html`.

## Estado: Pendiente
