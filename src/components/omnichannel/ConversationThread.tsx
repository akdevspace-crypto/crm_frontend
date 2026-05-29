"use client";

import { useState, useEffect, useRef } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { Send, PhoneCall, Check, CheckCheck, FileText, Sparkles, Mic, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConversationThread() {
  const { activeConversationId, conversations, messages, typingStatus, isMessagesLoading, addMessage } = useConversationStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConv ? (messages[activeConv.id] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeConv) return;
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const tempMsg: any = {
      id: tempId,
      sender: 'agent',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    addMessage(activeConv.id, tempMsg);
    setInputText('');

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      
      // If channel is Email, send an actual email
      if (activeConv.channel === 'email') {
        await fetch(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}/api/messages/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeConv.id,
            customerEmail: activeConv.customerEmail || 'testingforcompany.0@gmail.com',
            subject: 'Reply from Support',
            message: tempMsg.content,
            agentId: 'agent_placeholder'
          })
        });
      } else if (activeConv.channel === 'whatsapp') {
        // Send actual WhatsApp via Twilio
        await fetch(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}/api/messages/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeConv.id,
            message: tempMsg.content
          })
        });
      } else if (activeConv.channel === 'chat' || activeConv.channel === 'instagram' || activeConv.channel === 'messenger') {
        // Send actual Instagram message via Meta Graph API
        await fetch(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}/api/messages/send-instagram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeConv.id,
            message: tempMsg.content
          })
        });
      } else {
        // Standard WebRTC/Internal message
        await fetch(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}/api/v1/messages/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeConv.id,
            content: tempMsg.content,
            senderType: 'AGENT'
          })
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!activeConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
        <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  // Voice Call specific UI
  if (activeConv.channel === 'voice') {
    return (
      <div className="flex-1 flex flex-col bg-[#000]">
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
            <PhoneCall className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Live Call with {activeConv.customerName}</h2>
          <p className="text-slate-500 font-mono text-lg mb-8">03:14</p>
          
          <div className="flex gap-4">
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-500/30 transition-all">
              End Call
            </button>
            <button className="bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#222] transition-all">
              Mute
            </button>
            <button className="bg-[#111] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#222] transition-all">
              Hold
            </button>
          </div>
        </div>
        
        {/* Live Transcription Box */}
        <div className="h-64 border-t border-[#222] bg-[#050505] p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Live AI Transcription</span>
          </div>
          <p className="text-sm text-slate-400 italic">
            Customer: "Yes, I am looking at the billing statement right now..."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#000]">
      {/* Header */}
      <div className="h-16 border-b border-[#222] bg-[#050505] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-8 h-8">
            {activeConv.customerAvatar ? (
              <img
                src={activeConv.customerAvatar}
                alt={activeConv.customerName}
                className="w-8 h-8 rounded-full object-cover border border-[#222]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${activeConv.customerAvatar ? 'hidden' : ''} ${activeConv.channel === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' : 'bg-[#111] border border-[#222] text-slate-400'}`}>
              {activeConv.customerName === 'Instagram Contact' ? 'IG' : activeConv.customerName.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="font-bold text-white flex items-center gap-1.5">
            {activeConv.customerName}
            {activeConv.channel === 'instagram' && activeConv.customerName !== 'Instagram Contact' && activeConv.customerName !== 'Pending' && (
              <span title="Verified Identity"><CheckCheck className="w-3.5 h-3.5 text-blue-500" /></span>
            )}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#111] border border-[#222] text-slate-300 uppercase tracking-wide">
            {activeConv.channel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-2 hover:bg-[#111] hover:text-white rounded-lg transition-colors"><PhoneCall className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-[#111] hover:text-white rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {isMessagesLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Decrypting conversation history...</p>
          </div>
        ) : (
          <AnimatePresence>
            {activeMessages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.sender === 'agent' 
                    ? 'bg-primary text-white rounded-br-sm' 
                    : 'bg-[#111] border border-[#222] text-slate-200 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words break-all">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'agent' && (
                    msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {activeConversationId && typingStatus[activeConversationId] && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start"
              >
                <div className="bg-[#111] border border-[#222] p-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#050505] border-t border-[#222] shrink-0">
        <div className="flex items-end gap-2 bg-[#111] border border-[#222] rounded-2xl p-2 focus-within:border-primary transition-all">
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type your message..."
            className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-sm text-white py-2 px-1 placeholder-slate-500"
            rows={1}
          />
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Mic className="w-5 h-5" /></button>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2 bg-primary text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { MessageCircle } from 'lucide-react';
