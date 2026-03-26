import { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-aria-components';
import { cn } from '../../lib/cn.js';

const DEFAULT_SUBJECT = 'Activación Koin — validación de identidad (VTEX / GTM)';

function buildDefaultBody(razon, portalUrl) {
  const cuenta = razon || 'tu equipo';
  return `Hola — necesitamos completar la activación de validación de identidad Koin en VTEX/Google Tag Manager (aprox. 15–20 min).

Tienda / cuenta: ${cuenta}

Asistente paso a paso: ${portalUrl}

Requisitos: acceso administrador a VTEX y al contenedor GTM (ID GTM-…).`;
}

function isValidEmail(value) {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ActivationIntroPanel({ onComplete, form }) {
  const [gtmInstalled, setGtmInstalled] = useState(null);
  const [actor, setActor] = useState(null);
  const [copied, setCopied] = useState(false);

  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [delegateSubject, setDelegateSubject] = useState(DEFAULT_SUBJECT);
  const [delegateDraft, setDelegateDraft] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const razon = [form?.razonSocial].filter(Boolean).join(' ') || 'tu equipo';
  const portalUrl = typeof window !== 'undefined' ? window.location.href : '';

  const delegateBody = useMemo(() => buildDefaultBody(razon, portalUrl), [razon, portalUrl]);

  const openDelegateModal = useCallback(() => {
    setDelegateDraft(buildDefaultBody(razon, portalUrl));
    setDelegateSubject(DEFAULT_SUBJECT);
    setRecipientEmail('');
    setDelegateModalOpen(true);
  }, [razon, portalUrl]);

  async function copyDelegateText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function openMailto() {
    const to = recipientEmail.trim();
    if (!isValidEmail(to)) return;
    const href = `mailto:${to}?subject=${encodeURIComponent(delegateSubject)}&body=${encodeURIComponent(delegateDraft)}`;
    window.location.assign(href);
  }

  const canContinue = gtmInstalled !== null && actor !== null;
  const canMailto = isValidEmail(recipientEmail) && delegateDraft.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-gray-200)] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-600)]">
          Antes de empezar
        </p>
        <h2 className="mt-1 text-base font-semibold text-[var(--color-gray-900)]">Activación en VTEX y GTM</h2>
        <p className="mt-2 text-sm text-[var(--color-gray-600)]">
          <strong className="text-[var(--color-gray-800)]">Tiempo estimado total: 15–20 minutos</strong> (según permisos
          en VTEX y GTM). Podés pausar y retomar más tarde; guardamos tu progreso en este navegador.
        </p>
      </div>

      <div className="rounded-lg border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-4 text-sm text-[var(--color-gray-700)]">
        <p className="font-semibold text-[var(--color-gray-900)]">¿Qué es Google Tag Manager (GTM)?</p>
        <p className="mt-2 leading-relaxed">
          Es un <strong>contenedor de etiquetas</strong>: permite cargar el script de Koin sin editar el código de la
          tienda en cada cambio. Si ya usan GTM para analytics u otros tags, suele alcanzar con agregar una etiqueta
          nueva en el mismo contenedor.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--color-gray-900)]">¿La tienda ya tiene GTM instalado?</p>
        <p className="mt-1 text-xs text-[var(--color-gray-500)]">Nos ayuda a orientarte; podés cambiar de idea luego.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { id: 'yes', l: 'Sí' },
            { id: 'no', l: 'No' },
            { id: 'unsure', l: 'No estoy seguro' },
          ].map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setGtmInstalled(x.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                gtmInstalled === x.id
                  ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]'
                  : 'border-[var(--color-gray-300)] bg-white text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
              )}
            >
              {x.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--color-gray-900)]">¿Quién hará la configuración técnica?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActor('self')}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              actor === 'self'
                ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]'
                : 'border-[var(--color-gray-300)] bg-white text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
            )}
          >
            Yo
          </button>
          <button
            type="button"
            onClick={() => setActor('delegate')}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              actor === 'delegate'
                ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]'
                : 'border-[var(--color-gray-300)] bg-white text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
            )}
          >
            Otra persona (IT / ecommerce)
          </button>
        </div>
        {actor === 'delegate' && (
          <div className="mt-3 rounded-lg border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-3">
            <p className="text-xs text-[var(--color-gray-600)]">
              Abrí el mensaje para revisarlo, editarlo y enviarlo por correo al responsable técnico.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openDelegateModal}
                className="rounded-lg bg-[var(--color-brand-600)] px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                Compartir por correo
              </button>
              <Button
                type="button"
                onPress={() => copyDelegateText(delegateBody)}
                className="rounded-lg border border-[var(--color-gray-300)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-gray-800)] hover:bg-[var(--color-gray-50)]"
              >
                {copied ? '¡Copiado!' : 'Copiar texto rápido'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 border-t border-[var(--color-gray-100)] pt-4">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => onComplete({ gtmInstalled, actor })}
          className={cn(
            'rounded-lg px-5 py-2.5 text-sm font-semibold text-white',
            'bg-[var(--color-brand-600)] hover:opacity-95',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          Ir al asistente
        </button>
        <p className="max-w-full text-right text-[11px] leading-snug text-[var(--color-gray-500)]">
          Si ya estás en el chat y te arrepentís de estas respuestas, usá{' '}
          <strong className="text-[var(--color-gray-700)]">Cambiar respuestas iniciales</strong> arriba a la derecha para
          volver acá.
        </p>
      </div>

      {delegateModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setDelegateModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delegate-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-gray-200)] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[var(--color-gray-200)] px-5 py-4">
              <h2 id="delegate-modal-title" className="text-base font-semibold text-[var(--color-gray-900)]">
                Mensaje para delegar
              </h2>
              <p className="mt-1 text-sm text-[var(--color-gray-600)]">
                Revisá el asunto y el cuerpo, editá si hace falta e indicá el correo de quien va a configurar VTEX/GTM.
                Se abrirá tu aplicación de correo predeterminada (Outlook, Gmail en escritorio, etc.).
              </p>
            </div>
            <div className="max-h-[calc(90vh-12rem)] space-y-4 overflow-y-auto px-5 py-4">
              <div>
                <label htmlFor="delegate-email" className="text-xs font-semibold text-[var(--color-gray-700)]">
                  Correo del destinatario
                </label>
                <input
                  id="delegate-email"
                  type="email"
                  autoComplete="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="persona@empresa.com"
                  className="mt-1 w-full rounded-lg border border-[var(--color-gray-300)] px-3 py-2 text-sm text-[var(--color-gray-900)] outline-none focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[rgba(16,177,50,0.15)]"
                />
                {recipientEmail.trim() && !isValidEmail(recipientEmail) && (
                  <p className="mt-1 text-xs text-[var(--color-error-600)]">Ingresá un correo válido.</p>
                )}
              </div>
              <div>
                <label htmlFor="delegate-subject" className="text-xs font-semibold text-[var(--color-gray-700)]">
                  Asunto
                </label>
                <input
                  id="delegate-subject"
                  type="text"
                  value={delegateSubject}
                  onChange={(e) => setDelegateSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-gray-300)] px-3 py-2 text-sm text-[var(--color-gray-900)] outline-none focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[rgba(16,177,50,0.15)]"
                />
              </div>
              <div>
                <label htmlFor="delegate-body" className="text-xs font-semibold text-[var(--color-gray-700)]">
                  Mensaje
                </label>
                <textarea
                  id="delegate-body"
                  value={delegateDraft}
                  onChange={(e) => setDelegateDraft(e.target.value)}
                  rows={12}
                  className="mt-1 w-full resize-y rounded-lg border border-[var(--color-gray-300)] px-3 py-2 font-mono text-xs leading-relaxed text-[var(--color-gray-900)] outline-none focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[rgba(16,177,50,0.15)]"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--color-gray-200)] bg-[var(--color-gray-50)] px-5 py-4">
              <button
                type="button"
                onClick={() => setDelegateModalOpen(false)}
                className="rounded-lg border border-[var(--color-gray-300)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-gray-800)] hover:bg-[var(--color-gray-100)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => copyDelegateText(delegateDraft)}
                className="rounded-lg border border-[var(--color-gray-300)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-gray-800)] hover:bg-[var(--color-gray-100)]"
              >
                Copiar mensaje
              </button>
              <button
                type="button"
                disabled={!canMailto}
                onClick={openMailto}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold text-white',
                  'bg-[var(--color-brand-600)] hover:opacity-95',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                Abrir en cliente de correo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
