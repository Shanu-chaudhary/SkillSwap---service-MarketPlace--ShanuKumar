import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Send, MessageSquare, ArrowLeft } from 'lucide-react'
import { messageApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import { format, isToday, isYesterday } from 'date-fns'
import toast from 'react-hot-toast'

function formatMsgTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isToday(d))     return format(d, 'h:mm a')
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d')
}

export default function MessagesPage() {
  const { userId: paramUserId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]       = useState(paramUserId || null)
  const [messages, setMessages]           = useState([])
  const [input, setInput]                 = useState('')
  const [sending, setSending]             = useState(false)
  const [loadingConvs, setLoadingConvs]   = useState(true)
  const [loadingMsgs, setLoadingMsgs]     = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    messageApi.getConversations()
      .then(res => setConversations(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingConvs(false))
  }, [messages])

  useEffect(() => {
    if (!activeConv) return
    setLoadingMsgs(true)
    messageApi.getConversation(activeConv)
      .then(res => setMessages(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingMsgs(false))
  }, [activeConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)
    try {
      const res = await messageApi.send({ receiverId: activeConv, content })
      setMessages(prev => [...prev, res.data])
    } catch {
      toast.error('Failed to send message')
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const activeInfo = conversations.find(c => c.otherUserId === activeConv)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 page-container py-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-4">Messages</h1>

        <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 200px)', minHeight: 480 }}>
          {/* Sidebar */}
          <div className={`w-full md:w-72 border-r border-slate-100 flex flex-col shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-700">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">No conversations yet</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <button key={conv.conversationId}
                    onClick={() => setActiveConv(conv.otherUserId)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${activeConv === conv.otherUserId ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}>
                    <img
                      src={conv.otherUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUserName || 'U')}&background=6272f3&color=fff&size=40`}
                      alt={conv.otherUserName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-slate-800 truncate">{conv.otherUserName}</p>
                        <span className="text-xs text-slate-400 shrink-0 ml-1">{formatMsgTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageSquare size={48} className="mx-auto text-slate-200 mb-3" />
                  <p className="font-medium text-slate-500">Select a conversation</p>
                  <p className="text-xs text-slate-400 mt-1">or start one by messaging a service provider</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <button onClick={() => setActiveConv(null)} className="md:hidden btn-ghost p-1">
                    <ArrowLeft size={18} />
                  </button>
                  {activeInfo && (
                    <>
                      <img
                        src={activeInfo.otherUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeInfo.otherUserName || 'U')}&background=6272f3&color=fff&size=40`}
                        alt={activeInfo.otherUserName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{activeInfo.otherUserName}</p>
                        <p className="text-xs text-emerald-500 font-medium">Active</p>
                      </div>
                    </>
                  )}
                  {!activeInfo && (
                    <p className="font-semibold text-sm text-slate-800">New Conversation</p>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = msg.senderId === user?.id
                      return (
                        <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          {!isMine && (
                            <img
                              src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName || 'U')}&background=6272f3&color=fff&size=32`}
                              alt={msg.senderName}
                              className="w-7 h-7 rounded-full object-cover mr-2 mt-1 shrink-0"
                            />
                          )}
                          <div className={`max-w-xs lg:max-w-md ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMine
                                ? 'bg-primary-600 text-white rounded-br-sm'
                                : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-xs text-slate-400 px-1">{formatMsgTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-slate-100 flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message…"
                    className="input flex-1 rounded-xl"
                  />
                  <button onClick={handleSend} disabled={!input.trim() || sending}
                    className="btn-primary p-3 rounded-xl disabled:opacity-50">
                    {sending
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Send size={16} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
