"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, Dumbbell, MessageSquare, Plus, Target, BarChart3, Gift, Copy, CheckCircle, UserPlus, Trophy } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  color: "blue" | "green" | "purple" | "orange";
}

interface RecentActivity {
  name: string;
  exercise: string;
  time: string;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ activeCoachees: 0, weeklyWorkouts: 0, programs: 0, unreadMessages: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<{ total: number; converted: number; rewardMonths: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    totalClients: 0,
    todayRegistrations: 0,
    todayRegistrationBreakdown: { coaches: 0, clients: 0 },
  });

  // Admin-only access to system stats
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const email = data.email || '';
        setCurrentUserEmail(email);
        setIsAdmin(email === 'renhongtao2@gmail.com' || email === '344681953@qq.com');
      }
    } catch (e) {
      console.error('Failed to load current user:', e);
    }
  };


  useEffect(() => {
    fetchDashboardStats();
    fetchSystemStats();
  }, []);

  useEffect(() => {
    fetchReferralData();
  }, []);

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
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Referral Banner */}
      {referralCode && (
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎁 Invite Friends, Get 1 Month Free!</h2>
              <p className="text-blue-100">Share your referral code and both of you get 1 free month on any plan.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-mono text-xl font-bold tracking-wider">{referralCode}</span>
              <button onClick={handleCopyReferral} className="p-2 hover:bg-white/30 rounded-lg transition" title="Copy">
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {referralStats && (referralStats.converted > 0 || referralStats.rewardMonths > 0) && (
            <div className="mt-4 flex gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.total} Invites</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.converted} Converted</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{referralStats.rewardMonths} Months Earned</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="活跃学员" value={stats.activeCoachees} change="+2 本月" color="blue" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="本周训练" value={stats.weeklyWorkouts} change="较上周 +15%" color="green" />
        <StatCard icon={<Dumbbell className="w-5 h-5" />} label="训练计划" value={stats.programs} change="3 进行中" color="purple" />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="未读消息" value={stats.unreadMessages} change="需要回复" color="orange" />
      </div>

      {isAdmin && (
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">今日新注册</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.todayRegistrations}</p>
              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                <span>教练 {systemStats.todayRegistrationBreakdown.coaches}</span>
                <span>·</span>
                <span>学员 {systemStats.todayRegistrationBreakdown.clients}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">全部教练</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalCoaches}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">全部学员</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalClients}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">全部用户</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近训练记录</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">查看全部</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                <div className={"w-10 h-10 rounded-full " + item.color + " flex items-center justify-center text-white text-sm font-medium shrink-0"}>
                  {item.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.exercise}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
            <div className="space-y-2">
              <QuickAction label="添加新学员" icon={<Plus className="w-4 h-4" />} color="blue" href="/coachees" />
              <QuickAction label="创建训练计划" icon={<Calendar className="w-4 h-4" />} color="green" href="/programs" />
              <QuickAction label="AI 生成计划" icon={<Target className="w-4 h-4" />} color="purple" href="/programs" />
              <QuickAction label="查看学员进度" icon={<BarChart3 className="w-4 h-4" />} color="orange" href="/progress" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">本周总结</h3>
            <div className="space-y-2 text-sm text-blue-100">
              <div className="flex justify-between">
                <span>训练完成率</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "87%" }}></div>
              </div>
              <div className="flex justify-between">
                <span>平均RPE</span>
                <span className="font-semibold">7.2/10</span>
              </div>
              <div className="flex justify-between">
                <span>学员满意度</span>
                <span className="font-semibold">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }: StatCardProps) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
      <div className={"inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 " + (bg[color] || bg.blue)}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{change}</p>
    </div>
  );
}

function QuickAction({ label, icon, color, href }: { label: string; icon: React.ReactNode; color: "blue" | "green" | "purple" | "orange"; href?: string }) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  };
  if (href) {
    return <a href={href} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition " + (bg[color] || bg.blue)}>{icon}{label}</a>;
  }
  return (
    <button className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition " + (bg[color] || bg.blue)}>
      {icon}
      {label}
    </button>
  );
}