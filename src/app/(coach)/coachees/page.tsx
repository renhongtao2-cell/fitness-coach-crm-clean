'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, MessageSquare, ClipboardList, Filter, UserPlus, TrendingUp, Award } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from '@/components/Toast';

export default function CoacheesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [coachees, setCoachees] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCoachee, setSelectedCoachee] = useState<any>(null);
  const [addForm, setAddForm] = useState({ fullName: '', email: '', fitnessLevel: 'beginner', goals: '' });
  const [assignForm, setAssignForm] = useState({ programId: '' });
  const [adding, setAdding] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchCoachees();
    fetchPrograms();
  }, []);

  const fetchCoachees = async () => {
    try {
      const res = await fetch('/api/coachees');
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.coachees || []).map((c: any) => ({ ...c, id: c.id || c.user_id || "" }));
        setCoachees(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await fetch('/api/programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.programs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = coachees.filter((c: any) => {
    const ms = c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const ml = filterLevel === 'all' || c.fitness_level === filterLevel;
    return ms && ml;
  });

  const levelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-400 to-emerald-500';
      case 'intermediate': return 'from-emerald-500 to-teal-500';
      case 'advanced': return 'from-violet-500 to-purple-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const levelBg = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'advanced': return 'bg-violet-50 text-violet-700 border-violet-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const levelLabel = (level: string) => {
    if (level === 'beginner') return '初级';
    if (level === 'intermediate') return '中级';
    if (level === 'advanced') return '高级';
    return level;
  };

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim()) {
      showToast('error', '请输入姓名和邮箱');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addForm.email)) {
      showToast('error', '请输入有效的邮箱地址');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/coachees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: addForm.fullName,
          email: addForm.email,
          fitnessLevel: addForm.fitnessLevel,
          goals: addForm.goals ? addForm.goals.split(',').map((g: string) => g.trim()) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', '添加失败: ' + (data.error || '未知错误'));
        return;
      }
      showToast('success', '✅ 添加成功！');
      setAddForm({ fullName: '', email: '', fitnessLevel: 'beginner', goals: '' });
      setShowAddModal(false);
      setTimeout(fetchCoachees, 500);
    } catch (err: any) {
      showToast('error', '网络错误: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleAssign = async () => {
    if (!assignForm.programId) {
      showToast('error', '请选择训练计划');
      return;
    }
    setAssigning(true);
    try {
      const res = await fetch('/api/coachees/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coacheeEmail: selectedCoachee.email,
          programId: assignForm.programId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', '✅ 分配成功！');
        setTimeout(() => {
          setShowAssignModal(false);
          setSelectedCoachee(null);
          setAssignForm({ programId: '' });
        }, 1000);
      } else {
        showToast('error', '分配失败: ' + (data.error || '未知错误'));
      }
    } catch (err: any) {
      showToast('error', '网络错误: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const openAssignModal = (coachee: any) => {
    setSelectedCoachee(coachee);
    setAssignForm({ programId: '' });
    setShowAssignModal(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">学员管理</h1>
              <p className="text-sm text-gray-500 mt-0.5">管理所有学员信息 · 共 {coachees.length} 人</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />添加学员
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Search & Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索学员姓名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">全部级别</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: '总学员', value: coachees.length, icon: Users, color: 'from-emerald-500 to-teal-500' },
            { label: '初级', value: coachees.filter((c: any) => c.fitness_level === 'beginner').length, icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
            { label: '中级/高级', value: coachees.filter((c: any) => c.fitness_level === 'intermediate' || c.fitness_level === 'advanced').length, icon: Award, color: 'from-violet-500 to-purple-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coachees Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">还没有学员</p>
            <p className="text-sm text-gray-400 mb-4">点击「添加学员」开始管理你的第一批学员</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition"
            >
              <Plus className="w-4 h-4" />添加第一个学员
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((coachee: any) => (
              <div key={coachee.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-100 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${levelColor(coachee.fitness_level)} flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform`}>
                      {coachee.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{coachee.full_name}</h3>
                      <p className="text-sm text-gray-500">{coachee.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${levelBg(coachee.fitness_level)}`}>
                    {levelLabel(coachee.fitness_level)}
                  </span>
                </div>

                {coachee.goals && coachee.goals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {coachee.goals.slice(0, 3).map((g: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-100">
                        {g}
                      </span>
                    ))}
                    {coachee.goals.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md">
                        +{coachee.goals.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => router.push(`/messages?clientId=${coachee.id}`)}
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    发消息
                  </button>
                  <button
                    onClick={() => openAssignModal(coachee)}
                    className="flex-1 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    分配计划
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">添加学员</h2>
                <p className="text-xs text-gray-500">填写学员基本信息</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
                <input
                  type="text"
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="学员姓名"
                  required
                  disabled={adding}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="学员邮箱"
                  required
                  disabled={adding}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">训练级别</label>
                <select
                  value={addForm.fitnessLevel}
                  onChange={(e) => setAddForm({ ...addForm, fitnessLevel: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  disabled={adding}
                >
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">目标（逗号分隔）</label>
                <input
                  type="text"
                  value={addForm.goals}
                  onChange={(e) => setAddForm({ ...addForm, goals: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="增肌, 减脂, 力量提升"
                  disabled={adding}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-300 disabled:to-teal-300 text-white font-medium rounded-xl transition-all shadow-md"
              >
                {adding ? '添加中...' : '确认添加'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                disabled={adding}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">分配训练计划</h2>
                <p className="text-xs text-gray-500">
                  分配给 <span className="font-medium text-gray-700">{selectedCoachee?.full_name || selectedCoachee?.email}</span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">选择计划</label>
                <select
                  value={assignForm.programId}
                  onChange={(e) => setAssignForm({ ...assignForm, programId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  disabled={assigning}
                >
                  <option value="">-- 请选择 --</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} ({levelLabel(p.level)})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-300 disabled:to-teal-300 text-white font-medium rounded-xl transition-all shadow-md"
              >
                {assigning ? '分配中...' : '确认分配'}
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                disabled={assigning}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
