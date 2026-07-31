'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Users, Calendar, BarChart3, Settings, MessageSquare, Bell, LogOut, Menu, CreditCard, Zap, Home, ClipboardList } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { href: "/dashboard",   key: "nav.dashboard", icon: Home },
  { href: "/coachees",    key: "nav.clients",   icon: Users },
  { href: "/programs",    key: "nav.programs",  icon: ClipboardList },
  { href: "/progress",    key: "nav.progress",  icon: BarChart3 },
  { href: "/messages",    key: "nav.messages",  icon: MessageSquare },
  { href: "/settings",    key: "nav.settings",  icon: Settings },
  { href: "/pricing",     key: "nav.pricing",   icon: Zap },
  { href: "/billing",     key: "nav.billing",   icon: CreditCard }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: 'linear-gradient(180deg, #1E1B1A 0%, #2D2725 100%)' }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #7C3AED)' }}>
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Fit<span className="text-[#FF6B35]">Coach</span>
            </span>
          </div>
          <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const IconComp = item.icon;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'text-white shadow-lg'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, rgba(255,107,53,0.9), rgba(255,107,53,0.7))' } : {}}
              >
                <IconComp className="w-5 h-5 shrink-0" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF6B35, #7C3AED)' }}>
              {(user && user.fullName ? user.fullName[0] : user && user.email ? user.email[0] : "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-semibold">{(user && user.fullName) || (user && user.email) || t('sidebar.user')}</p>
              <p className="text-xs text-white/40">{(user && user.role === "coach") ? t('sidebar.coach') : t('sidebar.client')}</p>
            </div>
            <button onClick={() => signOut()} className="text-white/30 hover:text-white transition" title={t('sidebar.signOutTitle')}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
