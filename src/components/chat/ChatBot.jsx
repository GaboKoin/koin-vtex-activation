import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, TextField } from 'react-aria-components';
import { parseChatbotHtml } from '../../utils/extractChatbotGlobals.js';
import { matchIntent } from '../../utils/handleText.js';
import { STUB_KB, STUB_STEPS_PROGRESS } from '../../data/stubPlatformsKb.js';
import {
  clearActivationState,
  labelForNode,
  loadActivationState,
  saveActivationState,
} from '../../utils/activationStorage.js';
import { useOnboarding } from '../../context/OnboardingContext.jsx';
import ActivationIntroPanel from './ActivationIntroPanel.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatOptions from './ChatOptions.jsx';
import { cn } from '../../lib/cn.js';

function TypingRow() {
  return (
    <div className="flex gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gray-900)] text-xs font-bold text-[var(--color-brand-600)]"
        aria-hidden
      >
        K
      </div>
      <div className="flex items-center gap-1 rounded-[4px_12px_12px_12px] border border-[var(--color-gray-200)] bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-brand-600)]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-brand-600)] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-brand-600)] [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function chatInitials(name) {
  const t = (name || '').trim();
  if (!t) return 'Vos';
  const parts = t.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || '';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] || '';
  return (a + b).toUpperCase() || 'Vos';
}

let msgId = 0;
function nextId() {
  msgId += 1;
  return msgId;
}

function derivePhase(isVtex, saved) {
  if (!isVtex) return 'chat';
  if (saved?.introCompleted && saved.cur && saved.cur !== 'welcome') return 'resume-modal';
  if (!saved?.introCompleted) return 'intro';
  return 'chat';
}

export default function ChatBot({ platform, className }) {
  const { setChatProgressPercent, setStep8Complete, form, session } = useOnboarding();
  const email = session?.email ?? '';
  const nombre = session?.nombre ?? '';

  const userInitials = useMemo(
    () => chatInitials(nombre || [form.nombreContacto, form.apellidoContacto].filter(Boolean).join(' ') || form.razonSocial),
    [nombre, form.nombreContacto, form.apellidoContacto, form.razonSocial],
  );

  const [KB, setKB] = useState(null);
  const [STEPS_PROGRESS, setStepsProgress] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [cur, setCur] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [opts, setOpts] = useState([]);
  const [typing, setTyping] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [input, setInput] = useState('');
  const [barPercent, setBarPercent] = useState(5);
  const listRef = useRef(null);
  const [phase, setPhase] = useState(null);
  const bootDoneRef = useRef(false);
  const resumeRequestedRef = useRef(false);

  const isVtex = platform === 'VTEX';

  useEffect(() => {
    if (!isVtex) {
      setKB(STUB_KB);
      setStepsProgress(STUB_STEPS_PROGRESS);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/chatbot/index.html');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const { KB: k, STEPS_PROGRESS: sp } = parseChatbotHtml(html);
        if (!cancelled) {
          setKB(k);
          setStepsProgress(sp);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || 'Error al cargar el asistente');
          setKB(STUB_KB);
          setStepsProgress(STUB_STEPS_PROGRESS);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isVtex]);

  useLayoutEffect(() => {
    if (!KB || !STEPS_PROGRESS) return;
    bootDoneRef.current = false;
    const saved = loadActivationState(email);
    setPhase(derivePhase(isVtex, saved));
  }, [KB, STEPS_PROGRESS, isVtex, email]);

  const scrollBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollBottom();
  }, [messages, typing]);

  const applyProgress = useCallback(
    (step) => {
      if (!STEPS_PROGRESS) return;
      const p = STEPS_PROGRESS[step];
      if (p !== undefined) {
        setBarPercent(p);
        setChatProgressPercent(p);
      }
    },
    [STEPS_PROGRESS, setChatProgressPercent],
  );

  const showNode = useCallback(
    (nodeId, { delayFin } = {}) => {
      if (!KB) return;
      const node = KB[nodeId] || KB.welcome;
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), role: 'bot', html: node.text }]);
      setOpts(node.opts || []);
      applyProgress(nodeId);
      const p = STEPS_PROGRESS?.[nodeId];
      if (p !== undefined) {
        saveActivationState(email, { introCompleted: true, cur: nodeId, barPercent: p, nombre });
      }
      if (nodeId === 'fin') {
        setStep8Complete(true);
        setTimeout(() => setSuccessOpen(true), delayFin ?? 900);
      }
    },
    [KB, STEPS_PROGRESS, applyProgress, setStep8Complete, email, nombre],
  );

  const startWelcomeSequence = useCallback(() => {
    setCur('welcome');
    setTyping(true);
    setBarPercent(STEPS_PROGRESS?.welcome ?? 5);
    setChatProgressPercent(STEPS_PROGRESS?.welcome ?? 5);
    const greeting = nombre
      ? `Hola, ${nombre}. Bienvenido al asistente de activación VTEX.`
      : null;
    setMessages(greeting ? [{ id: nextId(), role: 'bot', text: greeting }] : []);
    setOpts([]);
    setTimeout(() => {
      showNode('welcome');
    }, 300);
  }, [STEPS_PROGRESS, setChatProgressPercent, showNode, nombre]);

  const resumeFromStorage = useCallback(() => {
    const saved = loadActivationState(email);
    if (!saved?.cur || !KB) return;
    setCur(saved.cur);
    const p = STEPS_PROGRESS?.[saved.cur];
    if (p !== undefined) {
      setBarPercent(p);
      setChatProgressPercent(p);
    }
    const resumeText = nombre
      ? `Hola de nuevo, ${nombre}. Retomamos el asistente desde donde lo dejaste.`
      : 'Retomamos el asistente desde donde quedaste. Seguí con las opciones de abajo.';
    setMessages([{ id: nextId(), role: 'bot', text: resumeText }]);
    setTyping(false);
    setTimeout(() => showNode(saved.cur), 350);
  }, [KB, STEPS_PROGRESS, setChatProgressPercent, showNode, email, nombre]);

  const resumeFromStorageRef = useRef(resumeFromStorage);
  const startWelcomeSequenceRef = useRef(startWelcomeSequence);
  resumeFromStorageRef.current = resumeFromStorage;
  startWelcomeSequenceRef.current = startWelcomeSequence;

  useEffect(() => {
    if (!KB || !STEPS_PROGRESS || phase !== 'chat') return;
    if (bootDoneRef.current) return;
    bootDoneRef.current = true;

    if (resumeRequestedRef.current) {
      resumeRequestedRef.current = false;
      resumeFromStorageRef.current();
      return;
    }

    startWelcomeSequenceRef.current();
  }, [phase, KB, STEPS_PROGRESS]);

  function go(label, next) {
    if (!KB || !KB[next]) {
      setMessages((m) => [...m, { id: nextId(), role: 'user', text: label }]);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: 'bot',
            text: 'Ese contenido no está disponible en el modo actual del asistente. Usá los botones o contactá a tu referente en Koin.',
          },
        ]);
        const node = KB?.[cur] || KB?.welcome;
        if (node?.opts) setOpts(node.opts);
      }, 450);
      return;
    }
    setMessages((m) => [...m, { id: nextId(), role: 'user', text: label }]);
    setOpts([]);
    setTyping(true);
    setCur(next);
    const delay = next === 'fin' ? 800 : 500;
    setTimeout(() => {
      showNode(next, { delayFin: next === 'fin' ? 900 : 0 });
    }, delay);
  }

  function handleFreeText(text) {
    const v = text.trim();
    if (!v || !KB) return;
    const next = matchIntent(v);
    if (!next || !KB[next]) {
      setMessages((m) => [...m, { id: nextId(), role: 'user', text: v }]);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: 'bot',
            text: 'No estoy seguro de entender esa pregunta. Si tiene que ver con alguno de los pasos de la instalación, podés consultarme con más detalle. Si preferís, usá los botones para avanzar.',
          },
        ]);
        const node = KB[cur] || KB.welcome;
        setOpts(node.opts || []);
      }, 500);
      return;
    }
    go(v, next);
  }

  const onSubmitInput = (e) => {
    e.preventDefault();
    if (!input.trim() || typing) return;
    const v = input;
    setInput('');
    handleFreeText(v);
  };

  function handleIntroComplete() {
    if (!STEPS_PROGRESS) return;
    saveActivationState(email, {
      introCompleted: true,
      cur: 'welcome',
      barPercent: STEPS_PROGRESS.welcome ?? 5,
      nombre,
    });
    bootDoneRef.current = false;
    setPhase('chat');
  }

  function handleResumeContinue() {
    resumeRequestedRef.current = true;
    bootDoneRef.current = false;
    setPhase('chat');
  }

  function handleResumeRestart() {
    clearActivationState(email);
    resumeRequestedRef.current = false;
    bootDoneRef.current = false;
    setPhase('intro');
  }

  function handleBackToIntro() {
    const ok = window.confirm(
      'Vas a volver al cuestionario inicial. Se borrará el progreso del asistente en este navegador y tendrás que responder de nuevo. ¿Continuar?',
    );
    if (!ok) return;
    clearActivationState(email);
    resumeRequestedRef.current = false;
    bootDoneRef.current = false;
    setStep8Complete(false);
    setSuccessOpen(false);
    setMessages([]);
    setOpts([]);
    setCur('welcome');
    setTyping(false);
    setInput('');
    const w = STEPS_PROGRESS?.welcome ?? 5;
    setBarPercent(w);
    setChatProgressPercent(w);
    setPhase('intro');
  }

  if (!KB || phase === null) {
    return (
      <div
        className={cn(
          'flex min-h-0 flex-1 items-center justify-center rounded-xl border border-[var(--color-gray-200)] bg-white text-sm text-[var(--color-gray-600)] shadow-sm',
          className,
        )}
      >
        Cargando asistente…
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-gray-200)] bg-white shadow-sm',
        className,
      )}
    >
      {loadError && isVtex && (
        <div className="border-b border-[var(--color-warning-600)] bg-[var(--color-warning-50)] px-4 py-2 text-xs text-[var(--color-gray-800)]">
          No se pudo cargar el flujo VTEX desde <code className="font-mono">/chatbot/index.html</code>. Mostrando
          mensaje genérico. ({loadError})
        </div>
      )}

      <div className="shrink-0 border-b border-[var(--color-gray-200)] bg-white">
        <div className="flex items-start justify-between gap-2 px-4 pb-2 pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gray-900)] text-sm font-bold text-[var(--color-brand-600)]">
              K
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[var(--color-gray-900)]">Koin</div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-600)]" aria-hidden />
                En línea
              </div>
              {isVtex && phase === 'chat' && (
                <p className="mt-1 text-[11px] leading-snug text-[var(--color-gray-500)]">
                  Tiempo estimado: <strong className="text-[var(--color-gray-700)]">15–20 min</strong> · Podés pausar y
                  retomar (progreso en este navegador)
                </p>
              )}
            </div>
          </div>
          {isVtex && phase === 'chat' && (
            <button
              type="button"
              onClick={handleBackToIntro}
              className="shrink-0 rounded-lg border border-[var(--color-gray-300)] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-brand-600)] hover:bg-[var(--color-brand-light)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.25)]"
            >
              Cambiar respuestas iniciales
            </button>
          )}
        </div>
        {phase === 'chat' && (
          <div className="px-4 pb-4">
            <div className="h-1 w-full bg-[var(--color-gray-100)]">
              <div
                className="h-full bg-[var(--color-brand-600)]"
                style={{
                  width: `${barPercent}%`,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {phase === 'intro' && isVtex && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--color-gray-50)] p-4">
          <ActivationIntroPanel form={form} onComplete={handleIntroComplete} />
        </div>
      )}

      {phase === 'resume-modal' && isVtex && (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[var(--color-gray-50)] p-6">
          <div
            className="w-full max-w-md rounded-xl border border-[var(--color-gray-200)] bg-white p-6 shadow-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
          >
            <h2 id="resume-title" className="text-base font-semibold text-[var(--color-gray-900)]">
              Retomamos donde lo dejaste{nombre ? `, ${nombre}` : ''}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">
              Tenías el asistente avanzado en:{' '}
              <strong className="text-[var(--color-gray-900)]">
                {labelForNode(loadActivationState(email)?.cur)}
              </strong>
              . ¿Querés continuar desde ahí o empezar de nuevo?
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleResumeRestart}
                className="rounded-lg border border-[var(--color-gray-300)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-gray-800)] hover:bg-[var(--color-gray-50)]"
              >
                Empezar de nuevo
              </button>
              <button
                type="button"
                onClick={handleResumeContinue}
                className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'chat' && (
        <>
          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[var(--color-gray-50)] p-4"
          >
            {messages.map((msg) =>
              msg.html ? (
                <ChatMessage key={msg.id} role={msg.role} html={msg.html} userInitials={userInitials} />
              ) : (
                <ChatMessage key={msg.id} role={msg.role} userInitials={userInitials}>
                  {msg.text}
                </ChatMessage>
              ),
            )}
            {typing && <TypingRow />}
          </div>

          <div className="shrink-0 border-t border-[var(--color-gray-200)] bg-white p-4">
            <ChatOptions options={opts} onSelect={go} disabled={typing} />
            <form onSubmit={onSubmitInput} className="mt-4 flex gap-2">
              <TextField
                value={input}
                onChange={setInput}
                className="min-w-0 flex-1"
                aria-label="Escribí tu mensaje"
              >
                <Input
                  placeholder="Escribí una pregunta…"
                  className={cn(
                    'w-full rounded-lg border border-[var(--color-gray-300)] bg-white px-4 py-2.5 text-sm text-[var(--color-gray-900)]',
                    'outline-none focus:border-[var(--color-brand-600)] focus:ring-[0_0_0_4px] focus:ring-[rgba(16,177,50,0.12)]',
                  )}
                />
              </TextField>
              <Button
                type="submit"
                isDisabled={typing || !input.trim()}
                className={cn(
                  'shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold text-white',
                  'bg-[#10B132] outline-none',
                  'hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.35)]',
                  'disabled:opacity-40',
                )}
              >
                Enviar
              </Button>
            </form>
          </div>
        </>
      )}

      {successOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="max-w-md rounded-2xl border border-[var(--color-gray-200)] bg-white p-8 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="koin-success-ring mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-50)] text-3xl text-[var(--color-success-600)] ring-2 ring-[var(--color-success-600)]">
              ✓
            </div>
            <h2 id="success-title" className="mt-4 text-lg font-semibold text-[var(--color-gray-900)]">
              ¡Validación activada!
            </h2>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">
              El componente de Koin está funcionando en tu tienda. Tus compradores ya cuentan con validación de
              identidad activa.
            </p>
            <button
              type="button"
              className={cn(
                'mt-6 w-full rounded-full py-3 text-sm font-semibold text-white',
                'bg-[var(--color-brand-600)] hover:opacity-95',
              )}
              onClick={() => setSuccessOpen(false)}
            >
              Ver resumen final
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
