import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const defaultForm = {
  razonSocial: '',
  nombreContacto: '',
  apellidoContacto: '',
  plataforma: 'VTEX',
};

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [step8Complete, setStep8Complete] = useState(false);
  const [chatProgressPercent, setChatProgressPercent] = useState(5);
  const [estrategiaId, setEstrategiaId] = useState(null);
  const [estrategiaCanal, setEstrategiaCanal] = useState(null);

  const login = useCallback((nombre, email) => {
    setSessionState({ nombre: nombre.trim(), email: email.trim().toLowerCase() });
  }, []);

  const logout = useCallback(() => {
    setSessionState(null);
    setEstrategiaId(null);
    setEstrategiaCanal(null);
    setStep8Complete(false);
    setChatProgressPercent(5);
  }, []);

  const updateForm = useCallback((patch) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      form,
      updateForm,
      step8Complete,
      setStep8Complete,
      chatProgressPercent,
      setChatProgressPercent,
      estrategiaId,
      setEstrategiaId,
      estrategiaCanal,
      setEstrategiaCanal,
    }),
    [session, login, logout, form, updateForm, step8Complete, chatProgressPercent, estrategiaId, estrategiaCanal],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding fuera de OnboardingProvider');
  }
  return ctx;
}
