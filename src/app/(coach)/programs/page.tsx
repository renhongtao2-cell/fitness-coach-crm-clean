"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus, Search, Dumbbell, Clock, Target, Sparkles, Edit2, Copy, Trash2 } from "lucide-react";
import AIGeneratorModal from "@/components/AIGeneratorModal";
import { showToast } from "@/components/Toast";

interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  level: string;
  equipment: string[];
  is_template: boolean;
  ai_generated: boolean;
  created_at: string;
}

const levelLabels: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const levelColors: Record<string, string> = { beginner: "bg-green-100 text-green-700", intermediate: "bg-blue-100 text-blue-700", advanced: "bg-purple-100 text-purple-700" };

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "templates">("all");
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<{type: string; text: string}>({type: '', text: ''});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programDetail, setProgramDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', weeks: 8, level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProgramId, setDeleteProgramId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignProgramId, setAssignProgramId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [coacheeList, setCoacheeList] = useState<any[]>([]);
  const [loadingCoachees, setLoadingCoachees] = useState(false);
  const [selectedCoacheeIds, setSelectedCoacheeIds] = useState<string[]>([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchCoachees = async () => {
    setLoadingCoachees(true);
    try {
      const res = await fetch("/api/coachees");
      if (res.ok) { const data = await res.json(); setCoacheeList(data.coachees || []); }
    } catch (err) { console.error("Failed to fetch coachees:", err); }
    finally { setLoadingCoachees(false); }
  };

  const toggleCoacheeSelection = (coacheeId: string) => {
    setSelectedCoacheeIds(prev =>
      prev.includes(coacheeId) ? prev.filter(id => id !== coacheeId) : [...prev, coacheeId]
    );
  };

  const selectAllCoachees = () => {
    if (selectedCoacheeIds.length === coacheeList.length) {
      setSelectedCoacheeIds([]);
    } else {
      setSelectedCoacheeIds(coacheeList.map(c => c.id));
    }
  };

  const openAssignModal = (programId: string) => {
    setAssignProgramId(programId);
    setSelectedCoacheeIds([]);
    setShowAssignModal(true);
    fetchCoachees();
  };

  const handleAssign = async () => {
    if (selectedCoacheeIds.length === 0) {
      showToast("error", "请选择至少一学员");
      return;
    }
    setAssigning(true);
    let successCount = 0;
    let failCount = 0;
    try {
      for (const coacheeId of selectedCoacheeIds) {
        const coachee = coacheeList.find(c => c.id === coacheeId);
        if (!coachee || !coachee.email) continue;
        try {
          const res = await fetch("/api/coachees/assign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coacheeEmail: coachee.email, programId: assignProgramId }),
          });
          const data = await res.json();
          if (res.ok) { successCount++; } else { failCount++; }
        } catch (e: any) { failCount++; }
      }
      if (successCount > 0) {
        const msg = `成功分配 ${successCount} 学员` + (failCount > 0 ? `，${failCount} 失败` : "") + "！";
        showToast("success", msg);
      } else {
        showToast("error", `Assignment failed (${failCount} )`);
      }
      setSelectedCoacheeIds([]);
      setShowAssignModal(false);
    } finally { setAssigning(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/programs/" + deleteProgramId, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "已Delete");
        setShowDeleteConfirm(false);
        setDeleteProgramId("");
        fetchPrograms();
      } else {
        const data = await res.json();
        showToast("error", "Delete失败: " + (data.error || "未知错误"));
      }
    } catch (e: any) { showToast("error", "Network error: " + e.message); }
    finally { setDeleting(false); }
  };

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/programs");
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.programs || []);
      }
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramDetail = async (programId: string) => {
    setDetailLoading(true);
    try {
      console.log("[FETCH] Getting program:", programId);
      const res = await fetch("/api/programs/" + programId);
      console.log("[FETCH] Response:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("[FETCH] data.program keys:", data.program ? Object.keys(data.program) : "null");
        console.log("[FETCH] weekly_structure:", JSON.stringify(data.program?.weekly_structure)?.substring(0, 200));
        setProgramDetail(data.program);
      } else {
        const errText = await res.text();
        console.log("[FETCH] Error:", errText.substring(0, 500));
        showToast("error", "Failed to load program details");
      }
    } catch (e: any) {
      console.error("[FETCH] Exception:", e);
      showToast("error", "Network error: " + (e.message || "未知错误"));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetail = (program: any) => {
    setSelectedProgram(program);
    setShowDetailModal(true);
    fetchProgramDetail(program.id);
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "templates" && p.is_template);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-500 mt-1">Manage and assign training programs to clients</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAiModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition text-sm">
            <Sparkles className="w-4 h-4" />AI Generate
          </button>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm">
            <Plus className="w-4 h-4" />New Program
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab("all")} className={"px-4 py-2 rounded-md text-sm font-medium transition " + (activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
          All Programs ({programs.length})
        </button>
        <button onClick={() => setActiveTab("templates")} className={"px-4 py-2 rounded-md text-sm font-medium transition " + (activeTab === "templates" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
          Templates ({programs.filter((p) => p.is_template).length})
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search programs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          {filteredPrograms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{program.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{program.description || "No description"}</p>
                    </div>
                    <div className="flex gap-1 ml-2 shrink-0">
                      <button onClick={() => showToast('info', 'Edit功能开发中')} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => showToast('info', 'Copy feature coming soon')} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition" title="Copy">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setDeleteProgramId(program.id); setShowDeleteConfirm(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{program.duration_weeks} weeks</span>
                    <span className="inline-flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{program.equipment?.join(", ")}</span>
                    {program.ai_generated && <span className="inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-500" />AI</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${levelColors[program.level] || levelColors.intermediate}`}>
                      {levelLabels[program.level] || program.level}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(program.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleViewDetail(program)}
                      className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
                    >
                      View Details
                    </button>
                    {program.ai_generated && (
                      <button
                        onClick={() => openAssignModal(program.id)}
                        className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-sm font-medium transition"
                        title="Assign to Client"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">暂无匹配的Programs</p>
              <p className="text-sm text-gray-400 mt-1">Try another search or create a new program</p>
            </div>
          )}
        </>
      )}

      {/* Program Detail Modal */}
      {showDetailModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden animate-fade-in flex flex-col">
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedProgram.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedProgram.description || "No description"}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {detailLoading ? (
                <div className="text-center py-12">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : programDetail ? (
                <div className="space-y-6">
                  <div className="flex gap-4 flex-wrap">
                    <span className={'px-3 py-1 rounded-full text-sm font-medium ' + (levelColors[selectedProgram.level] || levelColors.intermediate)}>
                      {levelLabels[selectedProgram.level] || selectedProgram.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" />{selectedProgram.duration_weeks}weeks
                    </span>
                    {programDetail.ai_generated && (
                      <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />AI Generate
                      </span>
                    )}
                  </div>
                  {selectedProgram.equipment && selectedProgram.equipment.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">所需器材</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProgram.equipment.map((eq: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{eq}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {programDetail.weekly_structure && programDetail.weekly_structure.length > 0 ? (() => {
                    console.log("[RENDER] programDetail exists:", !!programDetail);
                    console.log("[RENDER] weekly_structure:", programDetail?.weekly_structure);
                    console.log("[RENDER] ws length:", programDetail?.weekly_structure?.length);
                    console.log("[RENDER] ws[0]:", programDetail?.weekly_structure?.[0]);
                    console.log("DEBUG weekly_structure sample:", programDetail.weekly_structure?.slice(0, 1));
                    const ws = programDetail.weekly_structure;
                    const isPhases = ws.length > 0 && (ws[0].weeklySchedule || ws[0].phase);
                    if (isPhases) {
                      return ws.map((phase: any, pi: number) => (
                        <div key={pi} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-purple-50 px-4 py-2 font-medium text-sm text-purple-700">
                            {phase.phase || "第"+(pi+1)+"阶段"} - {phase.focus || ""}
                            {phase.weeks && phase.weeks.length === 2 && <span className="ml-2 text-gray-400">(第{phase.weeks[0]}-{phase.weeks[1]}weeks)</span>}
                          </div>
                          {(phase.weeklySchedule || []).map((day: any, di: number) => (
                            <div key={di} className="p-4">
                              <div className="font-medium text-gray-900 mb-2">{day.day}{day.workoutType ? " \u00b7 " + day.workoutType : ""}</div>
                              <div className="space-y-2">
                                {(day.exercises || []).map((ex: any, ei: number) => (
                                  <div key={ei} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2">
                                    <span className="text-gray-900 font-medium">{ex.name}</span>
                                    <div className="flex items-center gap-3 text-gray-500">
                                      <span>{ex.sets}组 x {ex.reps}</span>
                                      {ex.restSeconds && ex.restSeconds > 0 && <span>休息{ex.restSeconds}s</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ));
                    }
                    return ws.map((week: any, wi: number) => (
                      <div key={wi} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 font-medium text-sm text-gray-700">
                          第{week.week || wi + 1}weeks - {week.focus || "常规训练"}
                        </div>
                        {(week.days || []).map((day: any, di: number) => (
                          <div key={di} className="p-4">
                            <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                            <div className="space-y-2">
                              {(day.exercises || []).map((ex: any, ei: number) => (
                                <div key={ei} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2">
                                  <span className="text-gray-900 font-medium">{ex.name}</span>
                                  <div className="flex items-center gap-3 text-gray-500">
                                    <span>{ex.sets}组 x {ex.reps}</span>
                                    {ex.rest_seconds && ex.rest_seconds > 0 && <span>休息{ex.rest_seconds}s</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ));
                  })() : (
                    <div className="text-center py-8 text-gray-400">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无详细训练安排</p>
                    </div>
              )}
            </div>
              ) : (
                <div className="text-center py-12 text-gray-500">无法加载计划详情</div>
              )}
            </div>
            <div className="flex-shrink-0 px-6 py-3 border-t border-gray-200 flex gap-2 justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">关闭</button>
            </div>
          </div>
        </div>
      )}


      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-4">新建Programs</h2>
            {msg.text && (
              <div className={"mb-4 p-3 rounded-lg text-sm " + (msg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700")}>
                {msg.text}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">计划名称</label>
                <input type="text" value={createForm.name} onChange={(e) => setCreateForm({...createForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：增肌基础计划" required disabled={creating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea value={createForm.description} onChange={(e) => setCreateForm({...createForm, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="计划简介..." disabled={creating} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">weeks期（weeks）</label>
                  <input type="number" value={createForm.weeks} onChange={(e) => setCreateForm({...createForm, weeks: parseInt(e.target.value)||8})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" min="1" max="52" disabled={creating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                  <select value={createForm.level} onChange={(e) => setCreateForm({...createForm, level: e.target.value as "beginner"|"intermediate"|"advanced"})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" disabled={creating}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={async () => {
                if (!createForm.name.trim()) {
                  setMsg({type:'error',text:'请输入计划名称'});
                  return;
                }
                setCreating(true);
                setMsg({type:'',text:''});
                try {
                  const res = await fetch('/api/programs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createForm),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setMsg({type:'success',text:'创建成功！'});
                    setCreateForm({ name: '', description: '', weeks: 8, level: 'intermediate' });
                    setTimeout(() => {
                      setShowCreateModal(false);
                      fetchPrograms();
                    }, 1000);
                  } else {
                    setMsg({type:'error',text:'创建失败: '+(data.error||'未知错误')});
                  }
                } catch (err: any) {
                  console.error('Create error:', err);
                  setMsg({type:'error',text:'Network error: '+err.message});
                } finally {
                  setCreating(false);
                }
              }} disabled={creating} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition">{creating ? '创建中..' : '创建计划'}</button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition" disabled={creating}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <AIGeneratorModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
﻿
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">确认Delete</h2>
            <p className="text-sm text-gray-500 mb-6">Delete后将无法恢复，确定要继续吗？</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded-lg transition">{deleting ? "Delete中..." : "确认Delete"}</button>
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal - Multi-Select */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !assigning && setShowAssignModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-1">分配Programs</h2>
            <p className="text-sm text-gray-500 mb-4">选择学员接收此计划（可多选）</p>
            <div className="flex-1 overflow-y-auto space-y-2">
              {loadingCoachees ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : coacheeList.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No clients yet，请先Add Client</div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={selectedCoacheeIds.length === coacheeList.length && coacheeList.length > 0} onChange={selectAllCoachees} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">全选</span>
                  </div>
                  {coacheeList.map((c: any) => (
                    <button key={c.id} onClick={() => toggleCoacheeSelection(c.id)} className={"w-full px-3 py-3 text-left rounded-lg border transition flex items-center gap-3 " + (selectedCoacheeIds.includes(c.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50")}>
                      <input type="checkbox" checked={selectedCoacheeIds.includes(c.id)} onChange={() => {}} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none" />
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm shrink-0">
                        {(c.full_name || c.email || "?")[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.full_name || "未命名"}</p>
                        <p className="text-xs text-gray-500 truncate">{c.email}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button onClick={handleAssign} disabled={assigning || selectedCoacheeIds.length === 0} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition">
                {assigning ? "分配中..." : `确认分配 (${selectedCoacheeIds.length})`}
              </button>
              <button onClick={() => { setShowAssignModal(false); setSelectedCoacheeIds([]); }} disabled={assigning} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}