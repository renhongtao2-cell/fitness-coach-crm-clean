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
    goals: 'Muscle gain',
    level: 'intermediate',
    equipment: ['Dumbbell', 'Barbell'] as string[],
    durationWeeks: 8,
    experience: 'Has 1 year training experience',
    preferences: 'Prefers compound exercises, dislikes too many isolation exercises',
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [coachees, setCoachees] = useState<Coachee[]>([]);
  const [selectedCoachee, setSelectedCoachee] = useState('');
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null);

  const equipmentOptions = ['Dumbbell', 'Barbell', 'Cable', 'Machine', 'Yoga mat', 'Jump rope', 'Resistance band', 'Bodyweight'];

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
        setError(data.error || 'Generation failed');
      } else {
        const plan = data.plan;
        setResult(plan);
      }
    } catch {
      setError('Network error, please check connection');
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
      showToast('error', 'Cannot save: plan data not found');
      return;
    }

    setSaving(true);
    setError(null);

    console.log("[SAVE] program keys:", Object.keys(program || {}));
    console.log("[SAVE] program.phases:", program?.phases?.length);
    const payload = {
      name: program.name || 'AI-generated Training Plan',
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
        showToast('error', 'Save failed: ' + (data.error || 'Unknown error'));
      } else {
        const pid = data.program?.id || '';
        setSavedProgramId(pid);
        showToast('success', '✅ Saved to plan library!');
        onSaved?.(pid);
      }
    } catch (e: any) {
      showToast('error', 'Save failed: ' + (e.message || 'Unknown error'));
    }

    setSaving(false);
  };

  const handleAssign = async () => {
    if (!savedProgramId) {
      showToast('error', 'Please save to library first');
      return;
    }
    if (!selectedCoachee) {
      showToast('error', '⚠️ Please select a client');
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
        showToast('error', 'Assignment failed: ' + (data.error || ''));
      } else {
        showToast('success', '✅ Assigned to client successfully!');
        setSelectedCoachee('');
      }
    } catch (e: any) {
      showToast('error', 'Assignment failed: ' + (e.message || ''));
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
            AI Training Plan Generator
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Goal</label>
                <input
                  type="text"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="E.g.: Muscle gain, fat loss, strength improvement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Duration (weeks)</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Equipment</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="E.g.: Has 1 year training experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Preferences</label>
                <textarea
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  placeholder="E.g.: Prefers compound exercises, dislikes too many isolation exercises"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {generating && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">AI is generating your training plan...</p>
              <p className="text-sm text-gray-400 mt-2">Takes approximately 10-30 seconds</p>
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
                  <p className="text-xs text-gray-500">Weeks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{program.phases?.length || 0}</p>
                  <p className="text-xs text-gray-500">Phase</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900 capitalize">{program.level || formData.level}</p>
                  <p className="text-xs text-gray-500">Difficulty</p>
                </div>
              </div>

              {program.description && (
                <p className="text-sm text-gray-600">{program.description}</p>
              )}

              {program.phases?.map((phase: any, i: number) => (
                <details key={i} className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Phase {i + 1}: {phase.focus}
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    {phase.weeklySchedule?.map((day: any, j: number) => (
                      <div key={j} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{day.day} - {day.workoutType}</p>
                        <div className="mt-2 space-y-2">
                          {day.exercises?.map((ex: any, k: number) => (
                            <div key={k} className="text-sm flex items-start gap-2">
                              <span className="text-blue-600 font-medium shrink-0">{ex.name}</span>
                              <span className="text-gray-500">{ex.sets}{ex.sets} sets x {ex.reps} reps, rest {ex.restSeconds}s</span>
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
                  <p className="font-medium text-yellow-800 mb-2">Coach Suggestions</p>
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save to Library
                    </>
                  )}
                </button>

                {savedProgramId && (
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      Assign to Client
                    </label>
                    <select
                      value={selectedCoachee}
                      onChange={(e) => setSelectedCoachee(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Client</option>
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
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Assign to Client
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
              Start Generation
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
          >
            {result ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
