'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, Calendar, Dumbbell, Trash2, ClipboardList, Eye } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function CoacheesPage() {
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
        // Ensure each coachee has an id field
        const coacheesWithId = (data.coachees || []).map((c: any) => ({
          ...c,
          id: c.id || c.user_id || "",
        }));
        setCoachees(coacheesWithId);
        const mapped = (data.coachees || []).map((c: any) => ({ ...c, id: c.id || "" }));
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

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim()) {
      showToast('error', 'Please enter name and email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addForm.email)) {
      showToast('error', 'Please enter a valid email');
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
        showToast('error', 'Failed to add: ' + (data.error || 'Unknown error'));
        return;
      }
      showToast('success', '✅ Added successfully！');
      setAddForm({ fullName: '', email: '', fitnessLevel: 'beginner', goals: '' });
      setShowAddModal(false);
      setTimeout(fetchCoachees, 500);
    } catch (err: any) {
      showToast('error', 'Network error: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleAssign = async () => {
    if (!assignForm.programId) {
      showToast('error', 'Please select at least one program');
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
        showToast('success', '✅ Assigned successfully！');
        setTimeout(() => {
          setShowAssignModal(false);
          setSelectedCoachee(null);
          setAssignForm({ programId: '' });
        }, 1000);
      } else {
        showToast('error', 'Assignment failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      showToast('error', 'Network error: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const openAssignModal = (coachee: any) => {
    setSelectedCoachee(coachee);
    setAssignForm({ programId: '' });
    setShowAssignModal(true);
  };

  const levelLabel = (level: string) => {
    if (level === 'beginner') return 'Beginner';
    if (level === 'intermediate') return 'Intermediate';
    if (level === 'advanced') return 'Advanced';
    return level;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-500 mt-1">Manage all your client information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />Add Client
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No clients yet, click "Add Client" to start</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((coachee: any) => (
              <div key={coachee.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {coachee.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{coachee.full_name}</h3>
                      <p className="text-sm text-gray-500">{coachee.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coachee.fitness_level === 'beginner' ? 'bg-green-100 text-green-700' :
                    coachee.fitness_level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {levelLabel(coachee.fitness_level)}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/coachees/${coachee.id}`)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />Details
                  </button>
                  <button
                    onClick={() => openAssignModal(coachee)}
                    className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                  >
                    <ClipboardList className="w-3 h-3" />Assign Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Add Client</h2>
              <p className="text-sm text-gray-500 mb-4">Enter basic client information</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Client Name"
                    required
                    disabled={adding}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Client Email"
                    required
                    disabled={adding}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Level</label>
                  <select
                    value={addForm.fitnessLevel}
                    onChange={(e) => setAddForm({ ...addForm, fitnessLevel: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={adding}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <input
                    type="text"
                    value={addForm.goals}
                    onChange={(e) => setAddForm({ ...addForm, goals: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Muscle gain, Fat loss"
                    disabled={adding}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition"
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                  disabled={adding}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAssignModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Assign Programs</h2>
              <p className="text-sm text-gray-500 mb-4">
                Assign to <span className="font-medium text-gray-700">{selectedCoachee?.full_name || selectedCoachee?.email}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
                  <select
                    value={assignForm.programId}
                    onChange={(e) => setAssignForm({ ...assignForm, programId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={assigning}
                  >
                    <option value="">-- Please Select --</option>
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
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                  disabled={assigning}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
