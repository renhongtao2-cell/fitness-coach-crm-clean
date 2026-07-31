'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Weight, Calendar, BarChart3, Users, Download, Dumbbell, Target, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from '@/components/Toast';

export default function ProgressPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [selectedCoacheeId, setSelectedCoacheeId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'measurements' | 'logs'>('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/progress');
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to load'); }
      else { setData(json); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
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
          <button onClick={() => fetchData()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  const coachees = data?.coachees || [];
  const measurements = data?.measurements || [];
  const logs = data?.logs || [];
  const assignments = data?.assignments || [];

  const filteredMeasurements = selectedCoacheeId
    ? measurements.filter((m: any) => m.coachee_id === selectedCoacheeId).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : measurements.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredLogs = selectedCoacheeId
    ? logs.filter((l: any) => {
        const logCoachee = l.coachee_programs?.coachee_id;
        return logCoachee === selectedCoacheeId;
      })
    : logs;

  const stats = selectedCoacheeId ? computeStats(filteredMeasurements) : null;
  const allStats = !selectedCoacheeId ? computeStats(filteredMeasurements) : null;
  const displayStats = stats || allStats;

  const totalLogs = filteredLogs.length;
  const completedLogs = filteredLogs.filter((l: any) => l.completed).length;
  const completionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Progress</h1>
            <p className="text-gray-500 mt-1">View client training results and Body Metrics changes</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={selectedCoacheeId} onChange={(e) => setSelectedCoacheeId(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white pr-8">
              <option value="">All Clients</option>
              {coachees.map((c: any) => (<option key={c.id} value={c.id}>{c.full_name}</option>))}
            </select>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {(['overview', 'measurements', 'logs'] as const).map((tab) => (
            <button key={tab} onClick={() => setSelectedTab(tab)} className={'px-4 py-2 rounded-md text-sm font-medium transition ' + (selectedTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')} >
              {tab === 'overview' ? 'Overview' : tab === 'measurements' ? 'Measurements' : 'Training Logs'}
            </button>
          ))}
        </div>

        {coachees.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No client data available</p>
            <p className="text-sm text-gray-400 mt-1">Please Add Client first and record body measurements</p>
          </div>
        ) : selectedTab === 'overview' ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Weight" value={displayStats?.weightDelta != null ? (displayStats.weightDelta > 0 ? '+' : '') + displayStats.weightDelta.toFixed(1) + 'kg' : '-'} subtitle={displayStats?.weightDelta != null ? (displayStats.weightDelta > 0 ? '' : '') : 'No data'} trend={displayStats?.weightDelta} icon={<Weight className="w-5 h-5" />} color="blue" />
              <StatCard label="Body Fat %" value={displayStats?.bfDelta != null ? (displayStats.bfDelta > 0 ? '+' : '') + displayStats.bfDelta.toFixed(1) + '%' : '-'} subtitle={displayStats?.bfDelta != null ? (displayStats.bfDelta < 0 ? '' : '') : ''} trend={displayStats?.bfDelta} goodDirection="down" icon={<BarChart3 className="w-5 h-5" />} color="green" />
              <StatCard label="Chest Change" value={displayStats?.chestDelta != null ? (displayStats.chestDelta > 0 ? '+' : '') + displayStats.chestDelta.toFixed(1) + 'cm' : '-'} subtitle={displayStats?.chestDelta != null ? (displayStats.chestDelta > 0 ? '' : '') : ''} trend={displayStats?.chestDelta} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
              <StatCard label="Completion Rate" value={completionRate > 0 ? completionRate + '%' : '-'} subtitle={totalLogs > 0 ? completedLogs + '/' + totalLogs + ' ' : ''} icon={<CheckCircle className="w-5 h-5" />} color="orange" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Weight Trend" icon={<Weight className="w-5 h-5" />} color="blue">
                {filteredMeasurements.filter((m: any) => m.weight).length > 0 ? <LineChart data={filteredMeasurements.map((m: any) => ({ label: formatDate(m.date), value: m.weight }))} color="#3b82f6" /> : <EmptyChart message="" />}
              </ChartCard>
              <ChartCard title="Body Fat % Trend" icon={<BarChart3 className="w-5 h-5" />} color="green">
                {filteredMeasurements.filter((m: any) => m.body_fat_percent).length > 0 ? <LineChart data={filteredMeasurements.map((m: any) => ({ label: formatDate(m.date), value: m.body_fat_percent }))} color="#22c55e" /> : <EmptyChart message="" />}
              </ChartCard>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200"><h3 className="font-semibold text-gray-900">Client Program Assignments</h3></div>
              {assignments && assignments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {assignments.map((a: any) => (
                    <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"><Users className="w-4 h-4 text-blue-600" /></div>
                        <div><p className="text-sm font-medium text-gray-900">{a.profiles?.full_name || a.coachee_id}</p><p className="text-xs text-gray-500">{a.programs?.name || a.program_id}</p></div>
                      </div>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + getStatusColor(a.status)}>{getStatusLabel(a.status)}</span>
                    </div>
                  ))}
                </div>
              ) : (<div className="p-8 text-center text-gray-400">No programs assigned</div>)}
            </div>
          </>
        ) : selectedTab === 'measurements' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200"><h3 className="font-semibold text-gray-900">Body Measurement Records</h3></div>
            {filteredMeasurements.length === 0 ? (
              <div className="p-12 text-center text-gray-400"><Activity className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No body measurement records</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full">
                <thead className="bg-gray-50"><tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">(kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">(%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">(cm)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">(cm)</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMeasurements.map((m: any) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(m.date).toLocaleDateString('zh-CN')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.profiles?.full_name || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium">{m.weight || '-'}</td>
                      <td className="px-6 py-4 text-sm">{m.body_fat_percent || '-'}</td>
                      <td className="px-6 py-4 text-sm">{m.chest_circumference || '-'}</td>
                      <td className="px-6 py-4 text-sm">{m.waist_circumference || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900"></h3>
              <span className="text-sm text-gray-500">Total: {filteredLogs.length}</span>
            </div>
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-400"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No training logs</p></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredLogs.slice(0, 20).map((log: any) => (
                  <div key={log.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={'w-8 h-8 rounded-full flex items-center justify-center ' + (log.completed ? 'bg-green-100' : 'bg-gray-100')}>
                          {log.completed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Week {log.week_number} · {log.day_of_week}</p>
                          <p className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString('zh-CN')}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {log.total_duration && <span>{log.total_duration}min</span>}
                        {log.total_duration && log.total_volume && <span className="mx-2">·</span>}
                        {log.total_volume && <span>{log.total_volume}kg volume</span>}
                      </div>
                    </div>
                    {log.notes && <p className="text-sm text-gray-600 ml-11 mt-1">{log.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function computeStats(ms: any[]) {
  if (ms.length < 2) return null;
  const first = ms[0];
  const last = ms[ms.length - 1];
  return {
    weightDelta: last.weight != null && first.weight != null ? last.weight - first.weight : null,
    bfDelta: last.body_fat_percent != null && first.body_fat_percent != null ? last.body_fat_percent - first.body_fat_percent : null,
    chestDelta: last.chest_circumference != null && first.chest_circumference != null ? last.chest_circumference - first.chest_circumference : null,
    waistDelta: last.waist_circumference != null && first.waist_circumference != null ? last.waist_circumference - first.waist_circumference : null,
  };
}

function formatDate(ds: string) { const d = new Date(ds); return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }); }

function getStatusColor(s: string) { const c: Record<string,string> = { active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', paused: 'bg-yellow-100 text-yellow-700' }; return c[s] || 'bg-gray-100 text-gray-700'; }
function getStatusLabel(s: string) { const l: Record<string,string> = { active: 'In Progress', completed: 'Completed', paused: 'Paused' }; return l[s] || s; }

function StatCard({ label, value, subtitle, trend, goodDirection, icon, color }: any) {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
  const isPositive = trend == null ? true : goodDirection === 'down' ? trend <= 0 : trend >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={'inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ' + (colors[color] || colors.blue)}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={'text-xs mt-0.5 ' + (trend == null ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-red-500')}>{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, icon, color, children }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4"><span className={'text-' + color + '-600'}>{icon}</span><h3 className="font-semibold text-gray-900">{title}</h3></div>
      {children}
    </div>
  );
}

function LineChart({ data, color }: { data: { label: string; value: number | null }[]; color: string }) {
  const valid = data.filter(d => d.value != null && d.value > 0);
  if (valid.length < 2) return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Insufficient data, need at least 2 records</div>;
  const values = valid.map(d => d.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 20;
  const W = 400;
  const H = 160;
  const pts = valid.map((d, i) => ({ x: pad + (i / (valid.length - 1)) * (W - pad * 2), y: pad + (1 - (d.value! - min) / range) * (H - pad * 2), label: d.label, value: d.value }));
  const pathD = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
  const areaD = pathD + ' L' + pts[pts.length - 1].x + ',' + (H - pad) + ' L' + pts[0].x + ',' + (H - pad) + ' Z';
  const gid = color.replace('#', '');
  return (
    <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" style={{ height: H + 30 }}>
      <defs><linearGradient id={'g' + gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <path d={areaD} fill={'url(#g' + gid + ')'} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" /><text x={p.x} y={H - 4} textAnchor="middle" fill="#9ca3af" fontSize="10">{p.label}</text></g>))}
    </svg>
  );
}

function EmptyChart({ message }: { message: string }) { return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{message}</div>; }