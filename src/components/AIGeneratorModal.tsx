'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, CheckCircle, AlertCircle, Save, Users } from 'lucide-react';
import { showToast } from '@/components/Toast';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (planId: string) => void;
}

interface Coachee {
  id: string;
  full_name: string;
  email: string;
}

export default function AIGeneratorModal({ isOpen, onClose, onSaved }: AIGeneratorModalProps) {
  const [formData, setFormData] = useState({
    goals: '增肌',
    level: 'intermediate',
    equipment: ['哑铃', '杠铃'] as string[],
    durationWeeks: 8,
    experience: '有1年训练经验',
    preferences: '喜欢复合动作，不喜欢太多孤立训练',
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [coachees, setCoachees] = useState<Coachee[]>([]);
  const [selectedCoachee, setSelectedCoachee] = useState('');
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null);

  const equipmentOptions = ['哑铃', '杠铃', '绳索', '器械', '瑜伽垫', '跳绳', '弹力带', '自重'];

  const toggleEquipment = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e: string) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const loadCoachees = async () => {
    try {
      const res = await fetch('/api/coachees');
      const data = await res.json();
      if (res.ok && data.coachees) {
        setCoachees(data.coachees);
      }
    } catch (e) {
      console.error('[AIGen] Failed to load coachees', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCoachees();
      setResult(null);
      setError(null);
      setSavedProgramId(null);
      setSelectedCoachee('');
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '生成失败');
      } else {
        const plan = data.plan;
        setResult(plan);
      }
    } catch {
      setError('网络错误，请检查连接');
    }

    setGenerating(false);
  };

  const getProgram = () => {
    if (!result) return null;
    if (result.program) return result.program;
    return result;
  };

  const handleSave = async () => {
    const program = getProgram();
    if (!program) {
      showToast('error', '无法保存：未找到计划数据');
      return;
    }

    setSaving(true);
    setError(null);

    console.log("[SAVE] program keys:", Object.keys(program || {}));
    console.log("[SAVE] program.phases:", program?.phases?.length);
    const payload = {
      name: program.name || 'AI生成训练计划',
      description: program.description || '',
      weeks: program.weeks || formData.durationWeeks,
      level: formData.level,
      equipment: formData.equipment,
      phases: program.phases || [],
      ai_generated: true,
      is_template: true,
    };

    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast('error', '保存失败: ' + (data.error || '未知错误'));
      } else {
        const pid = data.program?.id || '';
        setSavedProgramId(pid);
        showToast('success', '✅ 已成功保存到计划库！');
        onSaved?.(pid);
      }
    } catch (e: any) {
      showToast('error', '保存失败: ' + (e.message || '未知错误'));
    }

    setSaving(false);
  };

  const handleAssign = async () => {
    if (!savedProgramId) {
      showToast('error', '⚠️ 请先保存到计划库');
      return;
    }
    if (!selectedCoachee) {
      showToast('error', '⚠️ 请选择一个学员');
      return;
    }

    setAssigning(true);
    setError(null);

    try {
      const res = await fetch('/api/coachees/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coacheeEmail: selectedCoachee, programId: savedProgramId }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast('error', '分配失败: ' + (data.error || '未知错误'));
      } else {
        showToast('success', '✅ 已成功分配给学员！');
        setSelectedCoachee('');
      }
    } catch (e: any) {
      showToast('error', '分配失败: ' + (e.message || '未知错误'));
    }

    setAssigning(false);
  };

  if (!isOpen) return null;

  const program = getProgram();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI 训练计划生成器
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Form */}
          {!result && !generating && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">训练目标</label>
                <input
                  type="text"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="例如：增肌、减脂、力量提升"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练水平</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练周期（周）</label>
                  <input
                    type="number"
                    value={formData.durationWeeks}
                    onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 8 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1"
                    max="52"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">可用器材</label>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleEquipment(item)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        formData.equipment.includes(item)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">训练经验</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="例如：有1年训练经验"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">特殊偏好</label>
                <textarea
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  placeholder="例如：喜欢复合动作，不喜欢太多孤立训练"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {generating && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">AI 正在为你生成训练计划...</p>
              <p className="text-sm text-gray-400 mt-2">大约需要 10-30 秒</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && program && !generating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">{program.name}</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{program.weeks || formData.durationWeeks}</p>
                  <p className="text-xs text-gray-500">周数</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{program.phases?.length || 0}</p>
                  <p className="text-xs text-gray-500">阶段</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900 capitalize">{program.level || formData.level}</p>
                  <p className="text-xs text-gray-500">难度</p>
                </div>
              </div>

              {program.description && (
                <p className="text-sm text-gray-600">{program.description}</p>
              )}

              {program.phases?.map((phase: any, i: number) => (
                <details key={i} className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    阶段 {i + 1}: {phase.focus}
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    {phase.weeklySchedule?.map((day: any, j: number) => (
                      <div key={j} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{day.day} - {day.workoutType}</p>
                        <div className="mt-2 space-y-2">
                          {day.exercises?.map((ex: any, k: number) => (
                            <div key={k} className="text-sm flex items-start gap-2">
                              <span className="text-blue-600 font-medium shrink-0">{ex.name}</span>
                              <span className="text-gray-500">{ex.sets}组 x {ex.reps}次，休息{ex.restSeconds}s</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}

              {program.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-medium text-yellow-800 mb-2">教练建议</p>
                  <ul className="space-y-1">
                    {program.tips.map((tip: string, ti: number) => (
                      <li key={ti} className="text-sm text-yellow-700">- {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      保存到计划库
                    </>
                  )}
                </button>

                {savedProgramId && (
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      分配给学员
                    </label>
                    <select
                      value={selectedCoachee}
                      onChange={(e) => setSelectedCoachee(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">选择学员</option>
                      {coachees.map((c) => (
                        <option key={c.id} value={c.email}>{c.full_name} ({c.email})</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={assigning || !selectedCoachee}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      {assigning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          分配中...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          分配给学员
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!result && !generating && (
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              开始生成
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
          >
            {result ? '关闭' : '取消'}
          </button>
        </div>
      </div>
    </div>
  );
}
