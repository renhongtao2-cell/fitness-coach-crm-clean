'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2, MessageSquare, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from '@/components/Toast';

export default function ClientMessagesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [coachName, setCoachName] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/client/message');
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to load'); }
      else {
        setMessages(json.messages || []);
        setCoachName(json.coachName || '');
        setClientId(json.clientId || '');
      }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/client/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMsg.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setNewMsg('');
        // Optimistically add to list
        setMessages(prev => [{
          id: 'temp_' + Date.now(),
          content: newMsg.trim(),
          coachee_id: clientId,
          coach_id: null,
          created_at: new Date().toISOString(),
          is_read: true,
        }, ...prev]);
        // Refresh to get real data
        setTimeout(fetchMessages, 300);
      } else {
        showToast('error', json.error || 'Failed to send');
      }
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setSending(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-white/10 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {coachName ? coachName[0].toUpperCase() : 'C'}
              </div>
              <div>
                <p className="font-semibold">{coachName || 'Your Coach'}</p>
                <p className="text-xs text-blue-100">Online Coaching</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium text-gray-500">No messages yet</p>
                <p className="text-sm mt-1">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.slice().reverse().map((msg: any) => {
                const isMine = clientId ? msg.coachee_id === clientId : (msg.coach_id === null || msg.coachee_id === clientId);
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${isMine
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2.5'
                      : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none px-4 py-2.5'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={sending || !newMsg.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <Dumbbell className="w-4 h-4" />
            Quick Tips
          </div>
          <ul className="list-disc ml-5 space-y-1 text-blue-700">
            <li>Submit your training logs regularly so your coach can track progress</li>
            <li>Ask questions about form, nutrition, or program adjustments</li>
            <li>Report any pain or discomfort immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
