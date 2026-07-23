"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { TranslationProvider, useTranslation } from '@/hooks/use-translation';

export default function ClientPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== "client") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <TranslationProvider>
      <ClientContent user={user} signOut={signOut} />
    </TranslationProvider>
  );
}

function ClientContent({ user, signOut }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">{t("common.appName")}</h1>
          </div>
          <button onClick={() => signOut()} className="text-sm text-gray-600 hover:text-gray-900">
            {t("sidebar.signOutTitle")}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">{t("dashboard.welcomeBack")}, {user.fullName || user.email}!</p>
      </main>
    </div>
  );
}
