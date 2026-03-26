import { useOnboarding } from '../../context/OnboardingContext.jsx';
import ChatBot from '../chat/ChatBot.jsx';
import { CANALES, getEstrategiasContratadas } from '../../data/estrategias.js';
import { cn } from '../../lib/cn.js';

const SUB_STEPS = [
  { key: 1, label: 'Instalar GTM en VTEX', doneAt: 45 },
  { key: 2, label: 'Regla en página de confirmación', doneAt: 60 },
  { key: 3, label: 'Tag con script de Koin', doneAt: 85 },
  { key: 4, label: 'Probar y publicar', doneAt: 100 },
];

function subStepVisual(percent, index) {
  const done = percent >= SUB_STEPS[index].doneAt;
  const firstOpen = SUB_STEPS.findIndex((s) => percent < s.doneAt);
  const current = firstOpen === index;
  return { done, current };
}

function EmptyCanal({ title, onVolver }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-gray-200)]',
        'bg-[var(--color-gray-50)] px-8 py-16 text-center',
      )}
      role="status"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gray-100)] text-2xl text-[var(--color-gray-400)]"
        aria-hidden
      >
        ◇
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--color-gray-600)]">
        Este canal todavía no tiene guía interactiva en el portal. Mientras tanto, consultá la documentación en el
        repo o a tu referente en Koin.
      </p>
      <button
        type="button"
        onClick={onVolver}
        className="mt-6 rounded-lg border border-[var(--color-gray-300)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
      >
        Elegir otro canal
      </button>
    </div>
  );
}

function SelectorEstrategia({ onSelect }) {
  const list = getEstrategiasContratadas();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-[var(--color-gray-900)]">Elegí una estrategia</h1>
      <p className="mt-1 text-sm text-[var(--color-gray-600)]">
        Solo se muestran las estrategias contratadas para tu cuenta. Después vas a elegir el canal (VTEX, Magento o
        API).
      </p>
      {!list.length && (
        <p className="mt-8 rounded-lg border border-dashed border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-6 text-sm text-[var(--color-gray-600)]">
          No hay estrategias contratadas cargadas para este cliente. Cuando la API esté conectada, las cards aparecerán
          acá.
        </p>
      )}
      <ul className="mt-8 grid gap-4 sm:grid-cols-1">
        {list.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => onSelect(e.id)}
              className={cn(
                'flex w-full flex-col rounded-xl border border-[var(--color-gray-200)] bg-white p-5 text-left shadow-sm transition-colors',
                'hover:border-[var(--color-brand-600)] hover:bg-[var(--color-brand-light)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.2)]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-base font-semibold text-[var(--color-gray-900)]">{e.title}</span>
                <span className="shrink-0 rounded-full bg-[var(--color-success-50)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-success-600)]">
                  {e.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-gray-600)]">{e.description}</p>
              <span className="mt-4 text-sm font-semibold text-[var(--color-brand-600)]">Continuar →</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SelectorCanal({ strategyTitle, onSelect, onBack }) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-[var(--color-brand-600)] hover:underline"
      >
        ← Volver a estrategias
      </button>
      <h1 className="mt-4 text-xl font-semibold text-[var(--color-gray-900)]">{strategyTitle}</h1>
      <p className="mt-1 text-sm text-[var(--color-gray-600)]">Elegí la plataforma donde está tu tienda.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {CANALES.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                'flex h-full w-full flex-col rounded-xl border border-[var(--color-gray-200)] bg-white p-4 text-left shadow-sm transition-colors',
                'hover:border-[var(--color-brand-600)] hover:bg-[var(--color-brand-light)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.2)]',
              )}
            >
              <span className="text-sm font-semibold text-[var(--color-gray-900)]">{c.label}</span>
              <p className="mt-2 flex-1 text-xs text-[var(--color-gray-600)]">{c.description}</p>
              <span className="mt-4 text-xs font-semibold text-[var(--color-brand-600)]">Seleccionar</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelLateral({ chatProgressPercent }) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[320px]">
      <section className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5 shadow-md">
        <h2 className="text-sm font-semibold text-[var(--color-gray-900)]">Progreso del paso</h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-gray-500)]">
          Cuatro hitos del flujo VTEX (se actualiza con el chat). Activación guiada total: ~15–20 min; podés pausar y
          retomar desde el mismo navegador.
        </p>
        <ul className="mt-5 space-y-3">
          {SUB_STEPS.map((s, i) => {
            const { done, current } = subStepVisual(chatProgressPercent, i);
            return (
              <li
                key={s.key}
                className={cn(
                  'flex items-center gap-3 rounded-lg border-2 px-3 py-3 text-sm transition-shadow',
                  done && 'border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]',
                  current &&
                    !done &&
                    'border-[var(--color-brand-600)] bg-[var(--color-brand-light)] text-[var(--color-brand-600)] shadow-sm',
                  !done && !current && 'border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]',
                )}
              >
                {done ? (
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-600)] text-sm font-bold text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      current
                        ? 'bg-[var(--color-brand-600)] text-white'
                        : 'border-2 border-[var(--color-gray-200)] bg-transparent text-[var(--color-gray-400)]',
                    )}
                    aria-hidden
                  >
                    {s.key}
                  </span>
                )}
                <span
                  className={cn(
                    'min-w-0 flex-1 font-medium leading-snug',
                    done && 'line-through decoration-[var(--color-gray-400)] decoration-1',
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5 shadow-md">
        <h2 className="text-base font-semibold text-[var(--color-gray-900)]">Documentos</h2>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-gray-600)]">
          Archivos de referencia disponibles para consulta.
        </p>
        <ul className="mt-4 space-y-4">
          <li>
            <a
              href="/manuals/v1.0.0_validacion_identidad_vtex_gtm.pdf"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-lg border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-4 transition-colors hover:border-[var(--color-brand-600)] hover:bg-[var(--color-brand-light)]"
            >
              <span className="text-sm font-semibold text-[var(--color-gray-900)] group-hover:text-[var(--color-brand-600)]">
                Manual — validación de identidad (VTEX / GTM)
              </span>
              <span className="mt-1 break-all font-mono text-xs text-[var(--color-gray-500)]">
                manuals/v1.0.0_validacion_identidad_vtex_gtm.pdf
              </span>
              <span className="mt-2 text-xs font-medium text-[var(--color-brand-600)]">Descargar PDF →</span>
            </a>
          </li>
          <li>
            <a
              href="/docs/08_estrategias/validacion_identidad/troubleshooting_vtex.md"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-lg border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-4 transition-colors hover:border-[var(--color-brand-600)] hover:bg-[var(--color-brand-light)]"
            >
              <span className="text-sm font-semibold text-[var(--color-gray-900)] group-hover:text-[var(--color-brand-600)]">
                Troubleshooting VTEX
              </span>
              <span className="mt-1 break-all font-mono text-xs text-[var(--color-gray-500)]">
                docs/08_estrategias/validacion_identidad/troubleshooting_vtex.md
              </span>
              <span className="mt-2 text-xs font-medium text-[var(--color-brand-600)]">Abrir en pestaña nueva →</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default function Step8Estrategias() {
  const {
    estrategiaId,
    setEstrategiaId,
    estrategiaCanal,
    setEstrategiaCanal,
    form,
    chatProgressPercent,
    session,
    logout,
  } = useOnboarding();

  const strategyMeta = getEstrategiasContratadas().find((e) => e.id === estrategiaId);

  function selectEstrategia(id) {
    setEstrategiaId(id);
    setEstrategiaCanal(null);
  }

  if (!estrategiaId) {
    return <SelectorEstrategia onSelect={selectEstrategia} />;
  }

  if (!estrategiaCanal) {
    return (
      <SelectorCanal
        strategyTitle={strategyMeta?.title || 'Estrategia'}
        onSelect={(id) => setEstrategiaCanal(id)}
        onBack={() => {
          setEstrategiaId(null);
          setEstrategiaCanal(null);
        }}
      />
    );
  }

  if (estrategiaCanal !== 'VTEX') {
    return (
      <EmptyCanal
        title={`${estrategiaCanal} — próximamente disponible`}
        onVolver={() => setEstrategiaCanal(null)}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-gray-900)]">Validación de identidad — VTEX</h1>
          <p className="mt-1 text-sm text-[var(--color-gray-600)]">
            Guía interactiva. Plataforma de referencia: <strong>{form.plataforma}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {session && (
            <span className="text-sm text-[var(--color-gray-700)]">
              <span className="font-medium">{session.nombre}</span>
              <span className="mx-1.5 text-[var(--color-gray-300)]">|</span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-[var(--color-gray-500)] hover:text-[var(--color-brand-600)] hover:underline"
              >
                Cerrar sesión
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => setEstrategiaCanal(null)}
            className="shrink-0 text-sm font-medium text-[var(--color-brand-600)] hover:underline"
          >
            Cambiar canal
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex min-h-0 flex-1 flex-col">
          <ChatBot platform="VTEX" className="min-h-0 flex-1" />
        </div>
        <PanelLateral chatProgressPercent={chatProgressPercent} />
      </div>
    </div>
  );
}
