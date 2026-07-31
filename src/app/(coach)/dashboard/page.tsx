"use client";

import { useEffect, useState } from "react";
import { Users, Dumbbell, MessageSquare, ClipboardList, TrendingUp, Plus, Copy, CheckCircle, Gift } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number; sub: string; color: string }) {
  const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
    orange: { bg: '#FFF5F0', text: '#FF6B35', iconBg: '#FF6B3520' },
    purple: { bg: '#F8F5FF', text: '#7C3AED', iconBg: '#7C3AED20' },
    green:  { bg: '#ECFDF5', text: '#10B981', iconBg: '#10B98120' },
    blue:   { bg: '#EFF6FF', text: '#3B82F6', iconBg: '#3B82F620' },
  };
  const c = colors[color] || colors.orange;
  return (
    <div className="stat-card bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.iconBg, color: c.text }}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          <p className="text-xs text-[#78716c] mt-0.5">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ activeCoachees: 0, weeklyWorkouts: 0, programs: 0, unreadMessages: 0 });
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchReferralData();
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.email === 'renhongtao2@gmail.com' || data.email === '344681953@qq.com');
      }
    } catch {}
  };

  const fetchDashboardStats = async () => {
    try {
      const [coacheesRes, programsRes] = await Promise.all([
        fetch("/api/coachees"),
        fetch("/api/programs"),
      ]);
      const coachees = coacheesRes.ok ? (await coacheesRes.json()).coachees || [] : [];
      const programs = programsRes.ok ? (await programsRes.json()).programs || [] : [];
      setStats({
        activeCoachees: coachees.length,
        weeklyWorkouts: 0,
        programs: programs.length,
        unreadMessages: 0,
      });
    } catch {}
  };

  const fetchReferralData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        fetch("/api/referral/code"),
        fetch("/api/referral/stats"),
      ]);
      if (codeRes.ok) setReferralCode((await codeRes.json()).code);
      if (statsRes.ok) setReferralStats(await statsRes.json());
    } catch {}
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-[#78716c] mt-1">Welcome back! Here's your coaching overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/coachees" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90" style={{ background: 'linear-gradient(135deg, #FF6B35, #E85D2C)' }}>
            <Plus className="w-4 h-4" /> Add Client
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Active Clients" value={stats.activeCoachees} sub={`${stats.activeCoachees} total`} color="orange" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="This Week" value={stats.weeklyWorkouts} sub="Workouts logged" color="green" />
        <StatCard icon={<ClipboardList className="w-5 h-5" />} label="Programs" value={stats.programs} sub={`${stats.programs} active`} color="purple" />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Messages" value={stats.unreadMessages} sub="Unread" color="blue" />
      </div>

      {/* Referral Banner */}
      {referralCode && (
        <div className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED, #FF6B35)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Gift className="w-full h-full" />
          </div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">🎁 Invite Friends — Get 1 Month Free!</h2>
              <p className="text-white/80 text-sm">Share your code. Both you and your friend get a free month.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2.5">
              <span className="font-mono text-xl font-bold tracking-wider">{referralCode}</span>
              <button onClick={async () => { await navigator.clipboard.writeText(referralCode!); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {referralStats && (referralStats.converted > 0 || referralStats.rewardMonths > 0) && (
            <div className="mt-4 flex gap-3 text-sm relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.total} Invites</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.converted} Converted</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.rewardMonths} Months Earned</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/coachees', icon: <Users className="w-5 h-5" />, label: 'Manage Clients', desc: 'View and manage your client roster', color: '#FF6B3520', text: '#FF6B35' },
          { href: '/programs', icon: <Dumbbell className="w-5 h-5" />, label: 'Training Programs', desc: 'Create and edit workout plans', color: '#7C3AED20', text: '#7C3AED' },
          { href: '/messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', desc: 'Chat with your clients', color: '#10B98120', text: '#10B981' },
        ].map((link, i) => (
          <Link key={i} href={link.href} className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: link.color, color: link.text }}>
                {link.icon}
              </div>
              <div>
                <p className="font-bold text-[#1c1917] text-sm">{link.label}</p>
                <p className="text-xs text-[#a8a29e] mt-0.5">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
