import { useState } from 'react';
import { clearActivationState, labelForNode, loadActivationState } from '../utils/activationStorage.js';
import { cn } from '../lib/cn.js';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function WelcomeScreen({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ nombre: false, email: false });
  const [pending, setPending] = useState(null);

  const nombreValid = nombre.trim().length > 0;
  const emailValid = isValidEmail(email);
  const canSubmit = nombreValid && emailValid;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const normalizedEmail = email.trim().toLowerCase();
    const saved = loadActivationState(normalizedEmail);

    if (saved?.introCompleted && saved.cur && saved.cur !== 'welcome') {
      setPending({ nombre: nombre.trim(), email: normalizedEmail, saved });
      return;
    }

    onLogin(nombre.trim(), normalizedEmail, null);
  }

  function handleResume() {
    if (!pending) return;
    onLogin(pending.nombre, pending.email, pending.saved);
  }

  function handleRestart() {
    if (!pending) return;
    clearActivationState(pending.email);
    onLogin(pending.nombre, pending.email, null);
  }

  if (pending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-gray-50)] p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-gray-900)] shadow-lg">
              <span className="text-xl font-bold text-[var(--color-brand-600)]">K</span>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--color-gray-200)] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-gray-900)]">
              Hola, {pending.nombre}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">
              Encontramos tu progreso anterior. Estabas en:{' '}
              <strong className="text-[var(--color-gray-900)]">
                {labelForNode(pending.saved.cur)}
              </strong>.
            </p>
            <p className="mt-1 text-sm text-[var(--color-gray-600)]">
              ¿Querés retomarlo o preferís empezar desde el principio?
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResume}
                className={cn(
                  'w-full rounded-lg py-3 text-sm font-semibold text-white',
                  'bg-[var(--color-brand-600)] hover:opacity-95',
                  'focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.35)] focus-visible:outline-none',
                )}
              >
                Sí, retomar donde lo dejé
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className={cn(
                  'w-full rounded-lg border border-[var(--color-gray-300)] bg-white py-3 text-sm font-semibold text-[var(--color-gray-800)]',
                  'hover:bg-[var(--color-gray-50)]',
                  'focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.15)] focus-visible:outline-none',
                )}
              >
                No, empezar desde el principio
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPending(null)}
            className="mt-4 w-full text-center text-xs text-[var(--color-gray-500)] hover:text-[var(--color-brand-600)] hover:underline"
          >
            ← Volver a ingresar datos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-gray-50)] p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-gray-900)] shadow-lg">
            <span className="text-xl font-bold text-[var(--color-brand-600)]">K</span>
          </div>
          <h1 className="mt-6 text-center text-xl font-semibold text-[var(--color-gray-900)]">
            Activación de validación de identidad
          </h1>
          <p className="mt-2 text-center text-sm text-[var(--color-gray-600)]">
            Ingresá tus datos para comenzar o retomar tu progreso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-[var(--color-gray-200)] bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="ws-nombre" className="text-sm font-medium text-[var(--color-gray-700)]">
              Nombre completo
            </label>
            <input
              id="ws-nombre"
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              placeholder="Ej: Fernando López"
              className={cn(
                'mt-1.5 w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-gray-900)] outline-none transition-colors',
                'placeholder:text-[var(--color-gray-400)]',
                'focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[rgba(16,177,50,0.15)]',
                touched.nombre && !nombreValid
                  ? 'border-[var(--color-error-600)]'
                  : 'border-[var(--color-gray-300)]',
              )}
            />
            {touched.nombre && !nombreValid && (
              <p className="mt-1 text-xs text-[var(--color-error-600)]">El nombre es obligatorio.</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="ws-email" className="text-sm font-medium text-[var(--color-gray-700)]">
              Email empresarial
            </label>
            <input
              id="ws-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="nombre@empresa.com"
              className={cn(
                'mt-1.5 w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-gray-900)] outline-none transition-colors',
                'placeholder:text-[var(--color-gray-400)]',
                'focus:border-[var(--color-brand-600)] focus:ring-2 focus:ring-[rgba(16,177,50,0.15)]',
                touched.email && !emailValid
                  ? 'border-[var(--color-error-600)]'
                  : 'border-[var(--color-gray-300)]',
              )}
            />
            {touched.email && email.trim() && !emailValid && (
              <p className="mt-1 text-xs text-[var(--color-error-600)]">Ingresá un email válido.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity',
              'bg-[var(--color-brand-600)]',
              'hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.35)] focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            Comenzar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--color-gray-500)]">
          Tu progreso se guarda localmente en este navegador.
        </p>
      </div>
    </div>
  );
}
