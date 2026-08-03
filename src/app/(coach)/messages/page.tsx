'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, Loader2, AlertCircle, ArrowLeft, Bot, User as UserIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from '@/components/Toast';

export default function MessagesPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-select from URL query param
  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      const conv = conversations.find((c: any) => c.partnerId === clientId);
      if (conv) {
        handleSelectConversation(conv);
        const url = new URL(window.location.href);
        url.searchParams.delete("clientId");
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, [conversations, searchParams]);

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
      if (!res.ok) { setError(json.error || '加载失败'); }
      else { setConversations(json.conversations || []); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  function handleSelectConversation(conv: any) {
    setSelectedConv(conv);
    if (conv.messages) {
      conv.messages.forEach((m: any) => { m.is_read = true; });
    }
  }

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
        showToast('success', '消息已发送');
        setSendMessage('');
        inputRef.current?.focus();
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
        showToast('error', '发送失败: ' + (json.error || '未知错误'));
      }
    } catch (e: any) {
      showToast('error', '发送失败: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c: any) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMsg?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">消息</h1>
            <p className="text-sm text-gray-500">{conversations.length} 个对话</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" style={{ minHeight: "600px" }}>
          <div className="flex h-full" style={{ minHeight: "600px" }}>
            {/* Conversation List */}
            <div className={`${selectedConv ? "hidden sm:flex" : "flex"} w-full sm:w-80 border-r border-gray-100 flex flex-col`}>
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索对话..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-7 h-7 text-emerald-300" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">暂无对话</p>
                    <p className="text-gray-400 text-xs mt-1">从学员列表开始聊天</p>
                  </div>
                ) : (
                  filteredConversations.map((conv: any) => (
                    <div
                      key={conv.partnerId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition cursor-pointer border-l-2 ${
                        selectedConv?.partnerId === conv.partnerId
                          ? "bg-emerald-50 border-emerald-500"
                          : "border-transparent"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                          {conv.avatar || conv.name?.[0] || '?'}
                        </div>
                        {conv.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-medium text-gray-900 truncate">{conv.name}</p>
                          {conv.time && (
                            <span className="text-xs text-gray-400 shrink-0 ml-2">
                              {new Date(conv.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMsg || '暂无消息'}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] rounded-full flex items-center justify-center shrink-0 font-bold shadow-sm">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConv ? (
              <div className={`${selectedConv ? "flex" : "hidden sm:flex"} flex-1 flex-col`}>
                {/* Chat Header */}
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="sm:hidden p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {selectedConv.avatar || selectedConv.name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{selectedConv.name}</p>
                    <p className="text-xs text-gray-400">
                      {selectedConv.online ? '在线' : '学员'}
                    </p>
                  </div>
                  {selectedConv.unread > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      {selectedConv.unread} 未读
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  {(selectedConv.messages || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-emerald-300" />
                      </div>
                      <p className="text-gray-500 font-medium">开始对话</p>
                      <p className="text-sm text-gray-400 mt-1">发送第一条消息给 {selectedConv.name}</p>
                    </div>
                  ) : (
                    (selectedConv.messages || []).map((msg: any) => {
                      const isMine = msg.sender === 'coach';
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-end gap-2 max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                              isMine
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                : "bg-gradient-to-br from-gray-300 to-gray-400"
                            }`}>
                              {isMine
                                ? <Bot className="w-3.5 h-3.5 text-white" />
                                : <UserIcon className="w-3.5 h-3.5 text-white" />
                              }
                            </div>
                            {/* Bubble */}
                            <div className={`${
                              isMine
                                ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-br-sm"
                                : "bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm"
                            } px-4 py-2.5`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                              <span className={`text-[10px] mt-1.5 block ${isMine ? "text-emerald-200" : "text-gray-400"}`}>
                                {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={sendMessage}
                      onChange={(e) => setSendMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="输入消息... (Enter 发送)"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !sendMessage.trim()}
                      className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">按 Enter 发送，Shift+Enter 换行</p>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-emerald-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">选择对话</p>
                  <p className="text-sm text-gray-400 mt-1">从左侧列表选择一个学员开始聊天</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
