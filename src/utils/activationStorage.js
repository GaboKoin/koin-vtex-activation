/** Persistencia del asistente VTEX — retomar sin perder el nodo del KB. */

function storageKey(email) {
  const normalized = (email || '').trim().toLowerCase().replace(/\s+/g, '');
  return `koin_vtex_progress_${normalized}`;
}

export function loadActivationState(email) {
  try {
    const raw = localStorage.getItem(storageKey(email));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.v !== 1 || typeof data.cur !== 'string') return null;
    return data;
  } catch {
    return null;
  }
}

export function saveActivationState(email, partial) {
  try {
    const prev = loadActivationState(email) || {};
    const next = {
      v: 1,
      nombre: partial.nombre ?? prev.nombre ?? '',
      introCompleted: Boolean(partial.introCompleted ?? prev.introCompleted),
      cur: partial.cur ?? prev.cur ?? 'welcome',
      barPercent: typeof partial.barPercent === 'number' ? partial.barPercent : prev.barPercent ?? 5,
      ts: Date.now(),
    };
    localStorage.setItem(storageKey(email), JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearActivationState(email) {
  try {
    localStorage.removeItem(storageKey(email));
  } catch {
    /* ignore */
  }
}

/** Etiquetas cortas para el modal de retomar (clave = id de nodo KB). */
export function labelForNode(cur) {
  const map = {
    welcome: 'Inicio del asistente',
    prereqs: 'Requisitos previos',
    donde_id_gtm: 'Dónde está el ID de GTM',
    paso1_vtex: 'Paso 1 — GTM en VTEX',
    app_no_encontrada: 'App no encontrada en VTEX',
    verificar_gtm: 'Verificar GTM',
    gtm_no_carga: 'GTM no carga',
    paso2_activador: 'Paso 2 — Activador / regla',
    que_es_path: 'Qué es la ruta de página',
    gtm_ayuda_activador: 'Ayuda activador',
    paso3_tag: 'Paso 3 — Tag Koin',
    sandbox_vs_prod: 'Sandbox vs producción',
    script_sandbox: 'Script sandbox',
    script_prod: 'Script producción',
    como_pegar_script: 'Cómo pegar el script',
    paso4_publicar: 'Paso 4 — Publicar',
    checklist: 'Checklist final',
    fin: 'Finalización',
    debug_menu: 'Menú de diagnóstico',
    support_contact: 'Contacto soporte',
    soporte_vtex: 'Soporte VTEX',
  };
  return map[cur] || cur.replace(/_/g, ' ');
}
