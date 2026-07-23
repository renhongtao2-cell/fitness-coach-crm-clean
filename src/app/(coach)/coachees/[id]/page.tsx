"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock, Weight, Activity, Calendar, Dumbbell, Target, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation';;
import { showToast } from "@/components/Toast";

export default function CoacheeDetailPage() {
  const { t } = useTranslation();
  
  const router = useRouter();
  const params = useParams();
  const coacheeId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coachee, setCoachee] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("info");
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [showProgramDetail, setShowProgramDetail] = useState(false);

  useEffect(() => {
    if (!coacheeId) {
      setError("Missing client ID");
      setLoading(false);
      return;
    }
    fetchData();
  }, [coacheeId]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/coachees/" + coacheeId);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load");
      } else {
        setCoachee(json.coachee);
        setPrograms(json.programs || []);
        setMeasurements(json.measurements || []);
        setLogs(json.logs || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back</button>
        </div>
      </div>
    );
  }

  const sortedMeasurements = [...measurements].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedLogs = [...logs].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {(coachee?.full_name || "?")[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{coachee?.full_name || "Unknown client"}</h1>
              <p className="text-sm text-gray-500">{coachee?.email || ""}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickStat icon={<Users className="w-5 h-5" />} label="Programs" value={programs.length} color="blue" />
          <QuickStat icon={<CheckCircle className="w-5 h-5" />} label="t('progress.title')" value={sortedLogs.length} color="green" />
          <QuickStat icon={<Weight className="w-5 h-5" />} label="t('progress.bodyWeight')" value={sortedMeasurements[0]?.weight || "-"} color="purple" />
          <QuickStat icon={<Target className="w-5 h-5" />} label="t('coachees.fitnessLevel')" value={coachee?.fitness_level ? ({ beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as Record<string, string>)[coachee.fitness_level] || "-" : "-"} color="orange" />
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {[
            { key: "info", label: "t('programs.basicInfo')" },
            { key: "programs", label: "Programs" },
            { key: "measurements", label: "t('coachees.bodyMeasurement')" },
            { key: "logs", label: "t('progress.title')" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={"px-4 py-2 rounded-md text-sm font-medium transition " + (selectedTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === "info" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />t('coachees.profile')
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name" value={coachee?.full_name || "-"} />
              <Field label="Email" value={coachee?.email || "-"} />
              <Field label="t('coachees.fitnessLevel')" value={coachee?.fitness_level ? ({ beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as Record<string, string>)[coachee.fitness_level] || "-" : "-"} />
              <Field label="Goals" value={Array.isArray(coachee?.goals) ? coachee.goals.join(", ") : "-"} />
              <Field label="t('coachees.joinDate')" value={coachee?.created_at ? new Date(coachee.created_at).toLocaleDateString("zh-CN") : "-"} />
              <Field label="t('coachees.assignProgram')" value={programs[0]?.coach_name || "-"} />
            </div>
          </div>
        )}

        {selectedTab === "programs" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />Programs
              </h3>
            </div>
            {programs.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No programs assigned</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {programs.map((prog: any) => (
                  <div key={prog.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => { setSelectedProgram(prog); setShowProgramDetail(true); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{prog.name}</p>
                        <p className="text-xs text-gray-500">{(prog.duration_weeks || "?")}weeks · {prog.level ? ({ beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as Record<string, string>)[prog.level] || prog.level : "-"} · {prog.start_date ? new Date(prog.start_date).toLocaleDateString("zh-CN") : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={"px-2 py-1 rounded-full text-xs font-medium " + getStatusColor(prog.status)}>{getStatusLabel(prog.status)}</span>
                      <span className="text-gray-400">›</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === "measurements" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />Body Measurement Records
              </h3>
            </div>
            {sortedMeasurements.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No body data available</p>
                <p className="text-sm mt-1">Ask the client to enter body measurements in their app</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body Fat %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chest (cm)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (cm)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hip (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedMeasurements.map((m: any) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(m.date).toLocaleDateString("zh-CN")}</td>
                        <td className="px-6 py-4 font-medium">{m.weight || "-"}</td>
                        <td className="px-6 py-4">{m.body_fat_percent ? m.body_fat_percent + "%" : "-"}</td>
                        <td className="px-6 py-4">{m.chest_circumference || "-"}</td>
                        <td className="px-6 py-4">{m.waist_circumference || "-"}</td>
                        <td className="px-6 py-4">{m.hip_circumference || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selectedTab === "logs" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />t('progress.title')
              </h3>
              <span className="text-sm text-gray-500">Total: {sortedLogs.length}</span>
            </div>
            {sortedLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No training logs yet</p>
                <p className="text-sm mt-1">Training records will appear here when clients complete workouts</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedLogs.map((log: any) => (
                  <LogDetailCard key={log.id} log={log} getDayLabel={getDayLabel} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showProgramDetail && selectedProgram && (
        <ProgramDetailModal program={selectedProgram} onClose={() => setShowProgramDetail(false)} />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={"w-10 h-10 rounded-lg flex items-center justify-center mb-2 " + (colors[color] || colors.blue)}>{icon}</div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function getStatusColor(s: string) {
  const c: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    paused: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return c[s] || "bg-gray-100 text-gray-700";
}

function getStatusLabel(s: string) {
  const l: Record<string, string> = {
    active: "Active",
    completed: "Completed",
    paused: "Paused",
    cancelled: "Cancelled",
  };
  return l[s] || s;
}

function getDayLabel(day: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day - 1] || ("Day " + day + "");
}

function ProgramDetailModal({ program, onClose }: { program: any; onClose: () => void }) {
  const phases = program.weekly_structure || [];
  const normalizedPhases: any[] = [];

  if (phases.length > 0 && phases[0].weekly_schedule) {
    phases.forEach((phase: any) => {
      normalizedPhases.push({
        phase_name: phase.phase || phase.name || "",
        duration_weeks: phase.duration_weeks || phase.weeks || 0,
        focus: phase.focus || "",
        schedule: phase.weekly_schedule || [],
      });
    });
  } else if (phases.length > 0 && phases[0].day) {
    normalizedPhases.push({
      phase_name: program.name || "Programs",
      duration_weeks: program.duration_weeks || 0,
      focus: program.description || "",
      schedule: phases,
    });
  } else if (phases.length > 0 && phases[0].days) {
    phases.forEach((phase: any) => {
      normalizedPhases.push({
        phase_name: phase.phase || phase.name || "",
        duration_weeks: phase.duration_weeks || phase.weeks || 0,
        focus: phase.focus || "",
        schedule: phase.days || [],
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{program.name}</h2>
            <p className="text-sm text-gray-500">{program.description || program.duration_weeks + "weeksPrograms"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {normalizedPhases.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No plan details available</div>
          ) : (
            <div className="space-y-6">
              {normalizedPhases.map((phase: any, pi: number) => (
                <div key={pi} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {phase.phase_name || ("Phase " + (pi + 1))}
                    {phase.duration_weeks > 0 && <span className="text-sm font-normal text-gray-500 ml-2">(" + phase.duration_weeks + "weeks)</span>}
                  </h3>
                  {phase.focus && <p className="text-sm text-gray-500 mb-3">{phase.focus}</p>}
                  <div className="space-y-3">
                    {phase.schedule.map((day: any, di: number) => {
                      const workoutType = day.workout_type || day.type || "";
                      const exercises = day.exercises || day.exercise_list || [];
                      return (
                        <div key={di} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">{getDayLabel(day.day || di + 1)} · {workoutType}</p>
                          {exercises.length > 0 ? (
                            <div className="space-y-1">
                              {exercises.map((ex: any, ei: number) => (
                                <div key={ei} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-700">{ex.name}</span>
                                  <span className="text-gray-500">
                                    {ex.sets && ex.reps ? (ex.sets + " sets x " + ex.reps + "") : ""}
                                    {ex.rest_seconds ? (" rest " + ex.rest_seconds + "s") : ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No exercise details</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogDetailCard({ log, getDayLabel }: { log: any; getDayLabel: (d: number) => string }) {
  const [expanded, setExpanded] = useState(false);
  const sets = log.workout_sets || [];
  const totalVol = log.total_volume || 0;
  const totalDur = log.total_duration || 0;

  return (
    <div className="px-6 py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={'w-8 h-8 rounded-full flex items-center justify-center ' + (log.completed ? 'bg-green-100' : 'bg-gray-100')}>
            {log.completed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Week {log.week_number} · {getDayLabel(log.day_of_week)}</p>
            <p className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {totalDur > 0 && <span>{totalDur}min</span>}
          {totalDur > 0 && totalVol !== 0 && <span className="mx-2">·</span>}
          {totalVol !== 0 && <span>{totalVol}kgtotal</span>}
        </div>
      </div>
      {sets.length > 0 && (
        <button onClick={() => setExpanded(!expanded)} className="ml-11 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-1">
          {expanded ? 'Collapse' : 'View Details'} ({sets.length} exercises)
        </button>
      )}
      {expanded && sets.length > 0 && (
        <div className="ml-11 mt-2 bg-gray-50 rounded-lg p-3 space-y-2">
          {sets.map((s: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs border-b border-gray-200 last:border-0 pb-2 last:pb-0">
              <span className="font-medium text-gray-800">{s.exercise_name || ('Exercise ' + (i + 1))}</span>
              <span className="text-gray-600">
                {s.sets && s.reps ? s.sets + ' sets x ' + s.reps + '' : ''}
                {s.weight ? ' ' + s.weight + (s.unit || 'kg') : ''}
              </span>
            </div>
          ))}
        </div>
      )}
      {log.notes && <p className="text-sm text-gray-600 ml-11 mt-1">{log.notes}</p>}
    </div>
  );
}

