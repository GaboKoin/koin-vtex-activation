/** KB mínimo para plataformas aún no documentadas (API / Magento). */
export const STUB_STEPS_PROGRESS = {
  welcome: 10,
  fin: 100,
};

export const STUB_KB = {
  welcome: {
    text: `Todavía estamos armando la guía interactiva para tu plataforma.<br><br>Por ahora, contactá a tu referente en Koin o visitá <a href="https://www.koin.com.br" target="_blank" rel="noreferrer">koin.com.br</a> para soporte.<br><br>Cuando el flujo esté publicado, vas a ver los mismos pasos detallados que hoy existen para VTEX.`,
    opts: [{ l: 'Entendido', n: 'fin' }],
  },
  fin: {
    text: `<div class="ok-box">Gracias por tu paciencia.</div><br>Te avisamos cuando esta sección esté lista.`,
    opts: [{ l: 'Volver al inicio', n: 'welcome' }],
  },
};
