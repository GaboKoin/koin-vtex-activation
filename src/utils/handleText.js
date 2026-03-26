/**
 * Misma lógica que el script del chatbot HTML (CHATBOT_SKILL §8).
 * Devuelve el id del siguiente nodo o null si no hay match (fallback).
 */
export function matchIntent(text) {
  const t = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (
    /c.mo (entro|accedo|ingreso|me logueo|inicio sesion|abro).*(vtex|admin|panel)/.test(t) ||
    /d.nde (entro|accedo|est.).*(vtex|admin)/.test(t) ||
    /entrar.*(admin|vtex)/.test(t) ||
    /admin.*(vtex|tienda).*c.mo/.test(t) ||
    /login.*vtex|vtex.*login/.test(t) ||
    /(acceso|acceder).*(vtex|admin)/.test(t)
  ) {
    return 'ctx_admin_vtex';
  }
  if (
    /c.mo (entro|accedo|ingreso|abro|uso).*(gtm|google tag|tag manager)/.test(t) ||
    /d.nde (est.|queda|encuentro|abro).*(gtm|tag manager)/.test(t) ||
    /entrar.*(gtm|tag manager)/.test(t) ||
    /abrir.*(gtm|tag manager)/.test(t)
  ) {
    return 'ctx_donde_gtm';
  }
  if (
    /(que es|para que sirve|que hace|como funciona).*(gtm|google tag|tag manager)/.test(t) ||
    /no s. que es.*(gtm|tag manager)/.test(t) ||
    /nunca us. gtm/.test(t)
  ) {
    return 'ctx_que_es_gtm';
  }
  if (
    /(crear|abrir|tener).*(cuenta|contenedor).*(gtm|tag manager)/.test(t) ||
    /(gtm|tag manager).*(crear|no tengo|necesito crear)/.test(t)
  ) {
    return 'ctx_crear_gtm';
  }
  if (/(que es|para que sirve|que hace).*(tag|etiqueta)/.test(t) || /no entiendo.*(tag|etiqueta)/.test(t)) {
    return 'ctx_que_es_tag';
  }
  if (
    /(que es|para que sirve|que hace).*(activador|trigger|regla)/.test(t) ||
    /no entiendo.*(activador|trigger)/.test(t)
  ) {
    return 'ctx_que_es_activador';
  }
  if (
    /(que es|que significa|para que).*(orderplaced|order.placed|confirmacion|confirmar compra)/.test(t) ||
    /pagina de confirmacion/.test(t)
  ) {
    return 'ctx_orderplaced';
  }
  if (/(que es|para que sirve|que hace).*(script|codigo)/.test(t) || /no entiendo.*(script|codigo)/.test(t)) {
    return 'ctx_que_es_script';
  }
  if (/(como|cuando|para que).*(publicar|publish)/.test(t) || /que significa publicar/.test(t)) {
    return 'ctx_publicar_gtm';
  }
  if (/nombre.*(cuenta|tienda).*vtex|no s. (cual|el nombre).*vtex/.test(t)) {
    return 'ctx_nombre_cuenta';
  }
  if (/paso 1|instalar gtm|instalar google|app store/.test(t)) return 'paso1_vtex';
  if (/paso 2|activador|regla|trigger/.test(t)) return 'paso2_activador';
  if (/paso 3|crear.*tag|crear.*etiqueta/.test(t)) return 'paso3_tag';
  if (/paso 4|publicar|vista previa|preview/.test(t)) return 'paso4_publicar';
  if (/sandbox|script.*prueba/.test(t)) return 'script_sandbox';
  if (/produccion|script.*real/.test(t)) return 'script_prod';
  if (/checklist|lista|verificacion final/.test(t)) return 'checklist';
  if (/requisito|antes de empezar|necesito saber/.test(t)) return 'prereqs';
  if (/no funciona|error|falla|algo mal|no anda/.test(t)) return 'debug_menu';
  if (/no.*(activa|dispara|fired|aparece el tag)/.test(t)) return 'debug_not_fired';
  if (
    /(modal|componente|ventana).*(no aparece|no carga|no se ve)/.test(t) ||
    /no aparece.*(koin|modal|componente)/.test(t)
  ) {
    return 'debug_no_modal';
  }
  if (/bloquea|compra.*bloquea|no avanza/.test(t)) return 'debug_checkout_blocked';
  if (/consola|console|f12|herramientas del navegador/.test(t)) return 'debug_console';
  if (/bloqueado|csp|refused to load|seguridad/.test(t)) return 'debug_csp';
  if (/todas las paginas|paginas incorrectas/.test(t)) return 'debug_wrong_pages';
  if (/soporte|contactar|contact|ayuda.*koin/.test(t)) return 'support_contact';

  return null;
}
