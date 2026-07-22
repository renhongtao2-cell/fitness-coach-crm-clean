'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, User, Loader2, AlertCircle } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv?.messages?.length]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to load'); }
      else { setConversations(json.conversations || []); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSelectConversation = (conv: any) => {
    setSelectedConv(conv);
    if (conv.messages) {
      conv.messages.forEach((m: any) => { m.is_read = true; });
    }
  };

  const handleSend = async () => {
    if (!sendMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coacheeId: selectedConv.partnerId, content: sendMessage.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast('success', 'Message sent successfully');
        setSendMessage('');
        const updated = { ...selectedConv, messages: [json.message, ...selectedConv.messages] };
        setSelectedConv(updated);
        setConversations(prev => {
          const idx = prev.findIndex((c: any) => c.partnerId === selectedConv.partnerId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], lastMsg: json.message.content, time: json.message.created_at };
            return updated.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
          }
          return prev;
        });
      } else {
        showToast('error', 'Send failed: ' + (json.error || 'Unknown error'));
      }
    } catch (e: any) {
      showToast('error', 'Send failed: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMsg.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">Communicate with clients</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ minHeight: "600px" }}>
          <div className="flex h-full" style={{ minHeight: "600px" }}>
            {/* Conversation List */}
            <div className={"w-full sm:w-80 border-r border-gray-200 flex flex-col " + (selectedConv ? "hidden sm:flex" : "")}>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv: any) => (
                    <div key={conv.partnerId} onClick={() => handleSelectConversation(conv)}
                      className={"flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer " + (selectedConv?.partnerId === conv.partnerId ? "bg-blue-50 border-r-2 border-blue-600" : "")}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shrink-0">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{conv.name}</p>
                          <span className="text-xs text-gray-400">{conv.time ? new Date(conv.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : ''}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMsg}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConv ? (
              <div className={"flex-1 flex flex-col " + (selectedConv ? "flex" : "hidden sm:flex")}>
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <button onClick={() => setSelectedConv(null)} className="sm:hidden mr-1 text-gray-500 hover:text-gray-700">
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">{selectedConv.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedConv.name}</p>
                    <p className="text-xs text-gray-400">Client</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {(selectedConv.messages || []).map((msg: any) => {
                    const isMine = msg.coach_id !== undefined;
                    return (
                      <div key={msg.id} className={"flex " + (isMine ? "justify-end" : "justify-start")}>
                        <div className={isMine
                          ? "bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 max-w-md"
                          : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-md"}>
                          <p className="text-sm">{msg.content}</p>
                          <span className={isMine ? "text-xs text-blue-200 mt-1 block" : "text-xs text-gray-400 mt-1 block"}>
                            {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input type="text" value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Type a message..." className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <button onClick={handleSend} disabled={sending || !sendMessage.trim()} className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition">
                      {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
