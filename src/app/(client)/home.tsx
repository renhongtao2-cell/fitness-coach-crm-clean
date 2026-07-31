'use client';
import { useState, useEffect } from 'react';
import { Calendar, Dumbbell, TrendingUp, MessageSquare, User, Clock, CheckCircle, AlertCircle, Loader2, ChevronRight, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from '@/components/Toast';

export default function ClientHome() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [todayLog, setTodayLog] = useState({ exercise: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/client/home');
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to load'); }
      else { setData(json); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSubmitLog = async () => {
    if (!todayLog.exercise.trim()) {
      showToast('error', 'Please enter training content');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/client/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise: todayLog.exercise.trim(), note: todayLog.note }),
      });
      const json = await res.json();
      if (res.ok) {
        setTodayLog({ exercise: '', note: '' });
        showToast('success', 'Training record submitted');
        fetchData();
      } else {
        showToast('error', 'Record failed: ' + (json.error || 'Unknown error'));
      }
    } catch (e: any) { showToast('error', 'Network error: ' + e.message); }
    finally { setSubmitting(false); }
  };

  const handleSendMessage = async () => {
    if (!msgText.trim()) {
      showToast('error', 'Please enter message content');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/client/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msgText.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setMsgSent(true);
        setMsgText('');
        showToast('success', 'Message sent');
        setTimeout(() => { setShowMsgModal(false); setMsgSent(false); }, 1500);
        fetchData();
      } else {
        showToast('error', 'Send failed: ' + (json.error || 'Unknown error'));
      }
    } catch (e: any) { showToast('error', 'Network error: ' + e.message); }
    finally { setSending(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  const programs = data?.programs || [];
  const measurements = data?.measurements || [];
  const logs = data?.logs || [];
  const messages = data?.messages || [];
  const todayCompleted = logs.filter((l: any) => new Date(l.date).toDateString() === new Date().toDateString()).length;
  const latestMeasurement = measurements.length > 0 ? measurements[0] : null;
  const myId = data?.coachee?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hello, {data?.coachee?.full_name || 'Client'}！</h1>
          <p className="text-gray-500 mt-1">Keep up the great training today! 💪</p>
        </div>

        <div className="mb-6">
          <button onClick={() => setShowMsgModal(true)} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200">
            <MessageSquare className="w-5 h-5" />
            Contact Coach
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard icon={<Dumbbell className="w-6 h-6" />} label="Training Plan" value={programs.length} color="blue" />
          <SummaryCard icon={<CheckCircle className="w-6 h-6" />} label="Completed Today" value={todayCompleted > 0 ? 'Yes' : 'No'} color={todayCompleted > 0 ? 'green' : 'orange'} />
          <SummaryCard icon={<TrendingUp className="w-6 h-6" />} label="Latest Weight" value={latestMeasurement?.weight ? latestMeasurement.weight + 'kg' : '-'} color="purple" />
          <SummaryCard icon={<MessageSquare className="w-6 h-6" />} label="New Messages" value={messages.length} color="pink" />
        </div>

        {/* Today's Log */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" />'s Training Log</h3>
          <div className="space-y-3">
            <input type="text" value={todayLog.exercise} onChange={(e) => setTodayLog({...todayLog, exercise: e.target.value})} placeholder="What training did you do? E.g.: Bench Press 3x10" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" disabled={submitting} />
            <input type="text" value={todayLog.note} onChange={(e) => setTodayLog({...todayLog, note: e.target.value})} placeholder="Notes (optional)" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" disabled={submitting} />
            <button onClick={handleSubmitLog} disabled={submitting || !todayLog.exercise.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}Submit Training Record
            </button>
          </div>
        </div>

        {/* Programs */}
        {programs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />My Trainining Plan</h3>
              <span className="text-sm text-gray-500">Total: {programs.length}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {programs.map((prog: any) => (
                <div key={prog.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{prog.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prog.status)}`}>{getStatusLabel(prog.status)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{prog.description || prog.duration_weeks + ' week plan'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Measurements */}
        {measurements.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />Body Metrics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2 text-left">Weight</th><th className="px-4 py-2 text-left">Body Fat %</th><th className="px-4 py-2 text-left">Chest</th><th className="px-4 py-2 text-left">Waist</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {measurements.slice(0, 5).map((m: any) => (
                    <tr key={m.id}><td className="px-4 py-3 text-sm">{new Date(m.date).toLocaleDateString('zh-CN')}</td><td className="px-4 py-3 text-sm font-medium">{m.weight || '-'}</td><td className="px-4 py-3 text-sm">{m.body_fat_percent ? m.body_fat_percent + '%' : '-'}</td><td className="px-4 py-3 text-sm">{m.chest_circumference || '-'}</td><td className="px-4 py-3 text-sm">{m.waist_circumference || '-'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-purple-600" />Recent Messages</h3>
              <span className="text-sm text-gray-500">Total: {messages.length}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {messages.slice(0, 10).map((msg: any) => {
                const isFromCoach = msg.coach_id !== myId;
                return (
                  <div key={msg.id} className={'px-6 py-4 ' + (isFromCoach ? 'bg-purple-50/50' : '')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-purple-600">{isFromCoach ? 'Coach' : 'Me'}</span>
                      <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString('zh-CN')}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !msgSent && setShowMsgModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6">
            {msgSent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-900">Message sent!</p>
                <p className="text-sm text-gray-500 mt-1">The coach will reply as soon as possible</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                  <div><p className="font-medium text-gray-900">Contact Coach</p><p className="text-xs text-gray-500">Ask me anything about your training</p></div>
                </div>
                <textarea value={msgText} onChange={(e) => setMsgText(e.target.value)} placeholder="Tell me your question, e.g.: My knee feels uncomfortable during training..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" rows={4} />
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSendMessage} disabled={sending || !msgText.trim()} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition flex items-center justify-center gap-2">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send
                  </button>
                  <button onClick={() => setShowMsgModal(false)} disabled={sending} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(s: string) { const c: Record<string,string> = { active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', paused: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700' }; return c[s] || 'bg-gray-100 text-gray-700'; }
function getStatusLabel(s: string) { const l: Record<string,string> = { active: 'In Progress', completed: 'Completed', paused: 'Paused', cancelled: 'Cancelled' }; return l[s] || s; }
function SummaryCard({ icon, label, value, color }: any) {
  const bg: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600', pink: 'bg-pink-50 text-pink-600' };
  return (<div className="bg-white rounded-xl border border-gray-200 p-4"><div className={'w-10 h-10 rounded-lg flex items-center justify-center mb-3 ' + (bg[color] || bg.blue)}>{icon}</div><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>);
}
