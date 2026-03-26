/**
 * Catálogo de estrategias. `CONTRACTED_STRATEGY_IDS` simula lo contratado por el cliente (demo: solo validación).
 * En el futuro vendrá de API / claims.
 */
export const CONTRACTED_STRATEGY_IDS = ['validacion_identidad'];

export const ESTRATEGIAS_CATALOGO = [
  {
    id: 'validacion_identidad',
    title: 'Validación de identidad',
    description: 'Liveness y escaneo de documento para comprobar identidad en el checkout.',
    badge: 'Contratada',
  },
  {
    id: 'token',
    title: 'Token',
    description: 'Envío de token por mail y WhatsApp.',
    badge: 'No contratada',
  },
  {
    id: 'passkey',
    title: 'Passkey',
    description: 'Inicio de sesión sin contraseña con passkeys.',
    badge: 'No contratada',
  },
  {
    id: 'magic_link',
    title: 'Magic Link',
    description: 'Acceso mediante enlace mágico.',
    badge: 'No contratada',
  },
  {
    id: '3ds',
    title: '3DS',
    description: 'Autenticación 3-D Secure.',
    badge: 'No contratada',
  },
];

export function getEstrategiasContratadas() {
  return ESTRATEGIAS_CATALOGO.filter((e) => CONTRACTED_STRATEGY_IDS.includes(e.id));
}

export const CANALES = [
  { id: 'VTEX', label: 'VTEX', description: 'Tienda en VTEX IO / CMS.' },
  { id: 'Magento', label: 'Magento', description: 'Adobe Commerce / Magento 2.' },
  { id: 'API', label: 'API directa', description: 'Integración vía API Koin.' },
];
