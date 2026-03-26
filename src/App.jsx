import { OnboardingProvider, useOnboarding } from './context/OnboardingContext.jsx';
import Step8Estrategias from './components/steps/Step8Estrategias.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';

function AppContent() {
  const { session, login } = useOnboarding();

  if (!session) {
    return <WelcomeScreen onLogin={(nombre, email) => login(nombre, email)} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-gray-50)] p-4 sm:p-6 lg:p-8">
      <Step8Estrategias />
    </div>
  );
}

export default function App() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  );
}
