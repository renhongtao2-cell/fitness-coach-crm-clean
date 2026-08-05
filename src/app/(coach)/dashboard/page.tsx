"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users, Calendar, Dumbbell, MessageSquare, Plus, Target,
  BarChart3, Gift, Copy, CheckCircle, UserPlus, Trophy,
  ArrowUp, ArrowDown, TrendingUp, Sparkles, Zap, Heart,
  Shield, Bell, Eye
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  changeType?: "up" | "down" | "neutral";
  gradient: string;
  glowColor?: string;
}

interface RecentActivity {
  name: string;
  exercise: string;
  time: string;
  color: string;
  avatar?: string;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ activeCoachees: 0, weeklyWorkouts: 0, programs: 0, unreadMessages: 0 });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<{ total: number; converted: number; rewardMonths: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0, totalCoaches: 0, totalClients: 0,
    todayRegistrations: 0, todayRegistrationBreakdown: { coaches: 0, clients: 0 },
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [animStats, setAnimStats] = useState({ activeCoachees: 0, weeklyWorkouts: 0, programs: 0, unreadMessages: 0 });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchSystemStats();
  }, []);

  useEffect(() => {
    fetchReferralData();
  }, []);

  // Animated counter effect
  useEffect(() => {
    setLoaded(true);
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimStats({
        activeCoachees: Math.round(stats.activeCoachees * eased),
        weeklyWorkouts: Math.round(stats.weeklyWorkouts * eased),
        programs: Math.round(stats.programs * eased),
        unreadMessages: Math.round(stats.unreadMessages * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  const fetchReferralData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        fetch("/api/referral/code"),
        fetch("/api/referral/stats"),
      ]);
      if (codeRes.ok) {
        const codeData = await codeRes.json();
        setReferralCode(codeData.code);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setReferralStats(statsData);
      }
    } catch (e) {
      console.error("Failed to load referral data:", e);
    }
  };


  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserEmail(data.email || "");
        setIsAdmin(data.role === "admin");
      }
    } catch (e) {
      console.error("Failed to fetch current user:", e);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setSystemStats(data);
      }
    } catch (e) {
      console.error("Failed to load system stats:", e);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [coacheesRes, programsRes] = await Promise.all([
        fetch("/api/coachees"),
        fetch("/api/programs"),
      ]);
      const coacheesResult = coacheesRes.ok ? await coacheesRes.json() : { coachees: [] };
      const programsResult = programsRes.ok ? await programsRes.json() : { programs: [] };

      setStats({
        activeCoachees: (coacheesResult.coachees || []).length,
        weeklyWorkouts: 0,
        programs: (programsResult.programs || []).length,
        unreadMessages: 0,
      });

      // Mock recent activities for visual demo (replace with real API when available)
      setRecentActivities([
        { name: 'Sarah Chen', exercise: 'completed Leg Day', time: '2 min ago', color: 'from-emerald-400 to-teal-500' },
        { name: 'James Liu', exercise: 'submitted body measurement', time: '15 min ago', color: 'from-blue-400 to-cyan-500' },
        { name: 'Emma Wilson', exercise: 'AI plan generated: PPL', time: '1 hour ago', color: 'from-violet-400 to-purple-500' },
        { name: 'David Park', exercise: 'checked in: Upper Body', time: '2 hours ago', color: 'from-amber-400 to-orange-500' },
      ]);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const handleCopyReferral = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const statCards: StatCardProps[] = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "活跃学员",
      value: animStats.activeCoachees,
      change: "+2 本月",
      changeType: "up",
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.3)",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "本周训练",
      value: animStats.weeklyWorkouts,
      change: "较上周 +15%",
      changeType: "up",
      gradient: "from-blue-500 to-cyan-600",
      glowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      icon: <Dumbbell className="w-5 h-5" />,
      label: "训练计划",
      value: animStats.programs,
      change: "3 进行中",
      changeType: "neutral",
      gradient: "from-violet-500 to-purple-600",
      glowColor: "rgba(139, 92, 246, 0.3)",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "未读消息",
      value: animStats.unreadMessages,
      change: "需要回复",
      changeType: "neutral",
      gradient: "from-amber-500 to-orange-600",
      glowColor: "rgba(245, 158, 11, 0.3)",
    },
  ];

  return (
    <div className={`space-y-6 ${loaded ? 'animate-fade-in' : ''}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Coach Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, Coach</h1>
            <p className="text-slate-400 text-sm">Here's what's happening with your clients today</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition backdrop-blur-sm relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg">
              C
            </div>
          </div>
        </div>
      </div>

      {/* Referral Banner */}
      {referralCode && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">邀请好友，各得1个月免费</h2>
                <p className="text-emerald-100 text-sm">分享你的邀请码，双方各得1个月免费</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="font-mono text-lg font-bold tracking-widest">{referralCode}</span>
              <button onClick={handleCopyReferral} className="p-1.5 hover:bg-white/20 rounded-lg transition" title="Copy">
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {referralStats && (referralStats.converted > 0 || referralStats.rewardMonths > 0) && (
            <div className="relative mt-3 flex gap-3 text-xs">
              <span className="bg-white/15 px-3 py-1 rounded-full">{referralStats.total} 次邀请</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">{referralStats.converted} 人转化</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">{referralStats.rewardMonths} 个月已领取</span>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`, '--tw-gradient-from': `#${card.gradient.split('-')[1]}500`, '--tw-gradient-to': `#${card.gradient.split('-')[3]}600` } as any}
          >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {card.icon}
                </div>
                {card.changeType === "up" && (
                  <span className="flex items-center gap-0.5 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                    <ArrowUp className="w-3 h-3" />{card.change}
                  </span>
                )}
                {card.changeType === "down" && (
                  <span className="flex items-center gap-0.5 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                    <ArrowDown className="w-3 h-3" />{card.change}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{card.value}</div>
              <div className="text-sm text-white/80">{card.label}</div>
              {card.changeType === "neutral" && (
                <div className="text-xs text-white/60 mt-1">{card.change}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">最近动态</h2>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">暂无活动记录</p>
              </div>
            ) : (
              recentActivities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-sm font-medium shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.exercise}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">快速操作</h2>
            <div className="space-y-2">
              <QuickAction label="添加新学员" icon={<Plus className="w-4 h-4" />} color="from-emerald-500 to-teal-600" href="/coachees" />
              <QuickAction label="创建训练计划" icon={<Calendar className="w-4 h-4" />} color="from-blue-500 to-cyan-600" href="/programs" />
              <QuickAction label="AI 生成计划" icon={<Target className="w-4 h-4" />} color="from-violet-500 to-purple-600" href="/programs" />
              <QuickAction label="查看学员进度" icon={<BarChart3 className="w-4 h-4" />} color="from-amber-500 to-orange-600" href="/progress" />
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-900 rounded-2xl p-5 text-white shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full filter blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold">本周总结</h3>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: '训练完成率', value: '87%', bar: '87%' },
                  { label: '平均RPE', value: '7.2/10', bar: '72%' },
                  { label: '学员满意度', value: '4.8/5', bar: '96%' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 text-xs">{item.label}</span>
                      <span className="font-semibold text-xs">{item.value}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full h-1.5 transition-all duration-1000"
                        style={{ width: item.bar, transitionDelay: `${i * 150}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">系统概览（管理员）</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '今日新注册', sub: `教练 ${systemStats.todayRegistrationBreakdown?.coaches ?? 0} · 学员 ${systemStats.todayRegistrationBreakdown?.clients ?? 0}`, value: systemStats.todayRegistrations ?? 0, gradient: 'from-emerald-50 to-teal-50 border-emerald-100 icon:from-emerald-500 to-teal-500', icon: <UserPlus className="w-5 h-5 text-white" /> },
              { label: '全部教练', value: systemStats.totalCoaches ?? 0, gradient: 'from-blue-50 to-cyan-50 border-blue-100', icon: <Users className="w-5 h-5 text-white" /> },
              { label: '全部学员', value: systemStats.totalClients ?? 0, gradient: 'from-violet-50 to-purple-50 border-violet-100', icon: <Trophy className="w-5 h-5 text-white" /> },
              { label: '全部用户', value: systemStats.totalUsers ?? 0, gradient: 'from-amber-50 to-orange-50 border-amber-100', icon: <Eye className="w-5 h-5 text-white" /> },
            ].map((item, i) => (
              <div key={i} className={`${item.gradient} rounded-xl border p-4 hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-500">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                {'sub' in item && item.sub && (
                  <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, change, changeType, gradient }: StatCardProps) {
  const changeColors = {
    up: "text-emerald-200 bg-white/15",
    down: "text-red-200 bg-white/15",
    neutral: "text-white/60",
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
      style={{ background: `linear-gradient(135deg, ${gradient})` }}>
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          {changeType && (
            <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${changeColors[changeType]}`}>
              {changeType === "up" && <ArrowUp className="w-3 h-3" />}
              {changeType === "down" && <ArrowDown className="w-3 h-3" />}
              {change}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-white/80">{label}</div>
        {changeType === "neutral" && <div className="text-xs text-white/60 mt-1">{change}</div>}
      </div>
    </div>
  );
}

function QuickAction({ label, icon, color, href }: { label: string; icon: React.ReactNode; color: string; href?: string }) {
  if (href) {
    return (
      <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r ${color} transition-all duration-200 group`}>
        <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">{icon}</span>
        {label}
      </a>
    );
  }
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r ${color} transition-all duration-200 group`}>
      <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">{icon}</span>
      {label}
    </button>
  );
}
