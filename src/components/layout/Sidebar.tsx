'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Users, Calendar, BarChart3, Settings, MessageSquare, Bell, LogOut, Menu, CreditCard, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { href: "/dashboard", key: "nav.dashboard" as const },
  { href: "/coachees", key: "nav.clients" as const },
  { href: "/programs", key: "nav.programs" as const },
  { href: "/progress", key: "nav.progress" as const },
  { href: "/messages", key: "nav.messages" as const },
  { href: "/settings", key: "nav.settings" as const },
  { href: "/pricing", key: "nav.pricing" as const },
  { href: "/billing", key: "nav.billing" as const }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={"fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 " + (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">{t('common.appName')}</span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition " + (isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white")}>
                {(() => {
                  const iconMap: Record<string, React.FC<{className?: string; size?: number}> | null> = {
                    '/dashboard': BarChart3, '/coachees': Users, '/programs': Calendar,
                    '/progress': BarChart3, '/messages': MessageSquare, '/settings': Settings,
                    '/pricing': Zap, '/billing': CreditCard,
                  };
                  const IconComp = iconMap[item.href];
                  return IconComp ? <IconComp className="w-5 h-5 shrink-0" /> : null;
                })()}
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {(user && user.fullName ? user.fullName[0] : user && user.email ? user.email[0] : "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{(user && user.fullName) || (user && user.email) || t('sidebar.user')}</p>
              <p className="text-xs text-slate-500">{(user && user.role === "coach") ? t('sidebar.coach') : t('sidebar.client')}</p>
            </div>
            <button onClick={() => signOut()} className="text-slate-500 hover:text-white transition" title={t('sidebar.signOutTitle')}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
