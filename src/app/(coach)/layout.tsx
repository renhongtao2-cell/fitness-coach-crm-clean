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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "coach") {
    router.push("/login");
    return null;
  }

  return (
    <TranslationProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </TranslationProvider>
  );
}
