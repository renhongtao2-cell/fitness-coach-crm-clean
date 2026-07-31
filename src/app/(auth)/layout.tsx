import { TranslationProvider } from '@/hooks/use-translation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #F8F5FF 50%, #ECFDF5 100%)' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }}></div>
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </TranslationProvider>
  );
}
