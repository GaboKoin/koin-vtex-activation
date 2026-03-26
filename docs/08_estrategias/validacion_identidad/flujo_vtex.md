# Módulo 03a — Activación VTEX

## Flujo completo

### Prerequisitos
- Acceso admin al VTEX Admin
- Cuenta Google con acceso a GTM
- Container ID disponible (GTM-XXXXXX)

### Paso 1 — Instalar GTM en VTEX
1. VTEX Admin → Apps / Extensions Hub → App Store
2. Buscar "Google Tag Manager" → Instalar
3. Ingresar Container ID
4. Guardar

### Paso 2 — Crear activador en GTM
- Nombre: `pageViewOrderPlaced`
- Tipo: Vista de una página
- Condición: Ruta de la página → contiene → `/checkout/orderPlaced`

### Paso 3 — Crear tag en GTM
- Nombre: `redirectStrategiesKoinPageView`
- Tipo: HTML personalizado
- Script Sandbox: `https://portal-dev.koin.com.br/argus-static/scripts/vtex/v1/gtm_script.js`
- Script Producción: `https://antifraud.koin.com.br/argus-static/scripts/vtex/v1/gtm_script.js`
- Activador: `pageViewOrderPlaced`

### Paso 4 — Publicar
1. Modo Vista previa → verificar tag fired en `/checkout/orderPlaced`
2. Enviar → Publicar

## Estado: ✅ Completo (v1.0.0)
