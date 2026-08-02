import { TranslationProvider } from '@/hooks/use-translation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        {children}
      </div>
    </TranslationProvider>
  );
}
