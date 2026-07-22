"use client";

import { useEffect, useState } from "react";
import { 
  Users, Calendar, Dumbbell, MessageSquare, Plus, Target, BarChart3, Gift, 
  Copy, CheckCircle, TrendingUp, Activity, ArrowRight, Zap, Award,
  ChevronRight, Sparkles, Eye
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  color: "blue" | "green" | "purple" | "orange";
  gradient: string;
  shadowColor: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ activeCoachees: 0, weeklyWorkouts: 0, programs: 0, unreadMessages: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<{ total: number; converted: number; rewardMonths: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
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

  const mockActivities = [
    { name: "张伟", exercise: "深蹲 4x12 @ 80kg", time: "2小时前", color: "from-blue-500 to-cyan-500" },
    { name: "李娜", exercise: "卧推 3x10 @ 50kg", time: "3小时前", color: "from-purple-500 to-pink-500" },
    { name: "王强", exercise: "硬拉 5x5 @ 100kg", time: "5小时前", color: "from-orange-500 to-red-500" },
    { name: "刘洋", exercise: "引体向上 4xMax", time: "昨天", color: "from-green-500 to-emerald-500" },
    { name: "陈静", exercise: "肩推 3x12 @ 30kg", time: "昨天", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-6 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl"></div>
          <div className="absolute bottom-10 right-40 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-blue-300 mb-1 font-medium">欢迎回来 👋</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">教练仪表盘</h1>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white transition-all duration-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                今天
              </button>
            </div>
          </div>
          <p className="mt-2 text-blue-200/70 max-w-md">以下是你的训练管理概览，快速掌握学员动态。</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<Users className="w-5 h-5" />} 
            label="活跃学员" 
            value={stats.activeCoachees} 
            change="+2 本月" 
            color="blue"
            gradient="from-blue-500 to-cyan-500"
            shadowColor="shadow-blue-500/25"
          />
          <StatCard 
            icon={<Activity className="w-5 h-5" />} 
            label="本周训练" 
            value={stats.weeklyWorkouts || 24} 
            change="较上周 +15%" 
            color="green"
            gradient="from-emerald-500 to-green-500"
            shadowColor="shadow-emerald-500/25"
          />
          <StatCard 
            icon={<Dumbbell className="w-5 h-5" />} 
            label="训练计划" 
            value={stats.programs} 
            change="3 进行中" 
            color="purple"
            gradient="from-purple-500 to-pink-500"
            shadowColor="shadow-purple-500/25"
          />
          <StatCard 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="未读消息" 
            value={stats.unreadMessages || 3} 
            change="需要回复" 
            color="orange"
            gradient="from-orange-500 to-red-500"
            shadowColor="shadow-orange-500/25"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Referral Banner */}
        {referralCode && (
          <div className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-xl shadow-purple-500/10">
            <div className="relative rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-0.5">🎁 邀请好友，各享免费一个月！</h2>
                    <p className="text-sm text-white/70">分享推荐码，双方均可获得任意套餐延长1个月有效期。</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5">
                    <span className="font-mono text-lg font-bold tracking-wider text-white">{referralCode}</span>
                    <button onClick={handleCopyReferral} className="p-1.5 hover:bg-white/20 rounded-md transition" title="Copy">
                      {copied ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-white/80" />}
                    </button>
                  </div>
                </div>
              </div>
              {referralStats && (referralStats.converted > 0 || referralStats.rewardMonths > 0) && (
                <div className="relative mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />{referralStats.total} 总邀请
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
                    <Award className="w-3.5 h-3.5 text-green-300" />{referralStats.converted} 已转化
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
                    <Zap className="w-3.5 h-3.5 text-blue-300" />{referralStats.rewardMonths} 个月奖励
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Training Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">最近训练记录</h2>
              </div>
              <a href="/progress" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition group-link">
                查看全部
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            <div className="divide-y divide-gray-50">
              {(recentActivities.length > 0 ? recentActivities : mockActivities).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group/item">
                  <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + item.color + " flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm group-hover/item:scale-105 transition-transform duration-200"}>
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.exercise}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{item.time}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-gray-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">快捷操作</h2>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <QuickAction 
                  label="添加新学员" 
                  icon={<Plus className="w-4 h-4" />} 
                  color="from-blue-500 to-cyan-500"
                  href="/coachees"
                />
                <QuickAction 
                  label="创建训练计划" 
                  icon={<Calendar className="w-4 h-4" />} 
                  color="from-emerald-500 to-green-500"
                  href="/programs"
                />
                <QuickAction 
                  label="AI 生成计划" 
                  icon={<Target className="w-4 h-4" />} 
                  color="from-purple-500 to-pink-500"
                  href="/programs"
                />
                <QuickAction 
                  label="查看学员进度" 
                  icon={<BarChart3 className="w-4 h-4" />} 
                  color="from-orange-500 to-red-500"
                  href="/progress"
                />
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold">本周训练总结</h3>
                </div>
                <div className="space-y-4">
                  <SummaryMetric label="训练完成率" value="87%" barWidth="87%" barColor="from-blue-400 to-cyan-400" />
                  <SummaryMetric label="平均RPE" value="7.2 / 10" barWidth="72%" barColor="from-purple-400 to-pink-400" showBar={false} />
                  <SummaryMetric label="学员满意度" value="4.8 / 5" barWidth="96%" barColor="from-emerald-400 to-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, gradient, shadowColor }: StatCardProps) {
  return (
    <div className={"group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-transparent hover:shadow-lg " + shadowColor + " transition-all duration-300 cursor-default"}>
      <div className="flex items-start justify-between mb-3">
        <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + gradient + " flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300"}>
          {icon}
        </div>
        <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      <div className={"absolute inset-0 rounded-2xl bg-gradient-to-br " + gradient + " opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"}></div>
    </div>
  );
}

function QuickAction({ label, icon, color, href }: { label: string; icon: React.ReactNode; color: string; href?: string }) {
  if (href) {
    return (
      <a href={href} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition group/action">
        <div className={"w-9 h-9 rounded-lg bg-gradient-to-br " + color + " flex items-center justify-center text-white shadow-sm group-hover/action:scale-110 transition-transform duration-200"}>
          {icon}
        </div>
        {label}
        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover/action:text-gray-500 group-hover/action:translate-x-0.5 transition-all" />
      </a>
    );
  }
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition group/action">
      <div className={"w-9 h-9 rounded-lg bg-gradient-to-br " + color + " flex items-center justify-center text-white shadow-sm group-hover/action:scale-110 transition-transform duration-200"}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function SummaryMetric({ label, value, barWidth, barColor, showBar = true }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      {showBar && (
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className={"bg-gradient-to-r " + barColor + " rounded-full h-1.5 transition-all duration-1000"} style={{ width: barWidth }}></div>
        </div>
      )}
    </div>
  );
}
