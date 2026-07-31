"use client";

import Sidebar from "@/components/layout/Sidebar";
import { TranslationProvider } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fafaf9' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (!user || user.role !== "coach") {
    router.push("/login");
    return null;
  }

  return (
    <TranslationProvider>
      <div className="flex min-h-screen" style={{ background: '#fafaf9' }}>
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </TranslationProvider>
  );
}
