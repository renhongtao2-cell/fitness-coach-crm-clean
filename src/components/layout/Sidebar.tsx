'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Users, Calendar, BarChart3, Settings, MessageSquare, Bell, LogOut, Menu, CreditCard, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/coachees", label: "Clients", icon: Users },
  { href: "/programs", label: "Programs", icon: Calendar },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Pricing", icon: Zap },
  { href: "/billing", label: "Billing", icon: CreditCard }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
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
          <span className="text-white font-bold text-lg">FitCoach</span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition " + (isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white")}>
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
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
              <p className="text-sm text-white truncate">{(user && user.fullName) || (user && user.email) || "User"}</p>
              <p className="text-xs text-slate-500">{(user && user.role === "coach") ? "Coach" : "Client"}</p>
            </div>
            <button onClick={() => signOut()} className="text-slate-500 hover:text-white transition" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}






