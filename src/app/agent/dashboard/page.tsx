"use client";

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Users, Ticket, ArrowUpRight, ArrowDownRight,
  PhoneMissed, PhoneIncoming, PhoneOutgoing, MoreHorizontal,
  UserRound, Plus, ChevronDown, CheckCircle2, Clock, XCircle, MessageSquare
} from 'lucide-react';
import { useCallStore } from '@/store/useCallStore';
import Link from 'next/link';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { TransferCallModal } from '@/components/calls/TransferCallModal';

export default function AgentDashboard() {
  const { status, setStatus } = useCallStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Agent');
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferAgent, setSelectedTransferAgent] = useState<{name: string, department: string} | null>(null);

  // Exact statuses requested by user
  const statuses = [
    { value: 'AVAILABLE', label: 'Available', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { value: 'BREAK', label: 'Break', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { value: 'OFFLINE', label: 'Offline', icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  ];

  const currentStatus = statuses.find(s => s.value === useCallStore.getState().baseStatus) || statuses[0];

  const handleStatusChange = (newStatus: string) => {
    useCallStore.getState().setBaseStatus(newStatus);
    const { status, setStatus } = useCallStore.getState();
    if (status !== 'BUSY' && status !== 'ON_CALL') {
      setStatus(newStatus as any);
    }
    setIsStatusDropdownOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        
        let localAgentId = null;
        const userStr = localStorage.getItem('crm_user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.name) setUserName(user.name.split(' ')[0]);
            if (user.agentId) {
              localAgentId = user.agentId;
              setAgentId(user.agentId);
            }
          } catch (e) {}
        }

        const agentIdQuery = localAgentId ? `?agentId=${localAgentId}` : '';
        const res = await fetch(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}/api/v1/agents/dashboard-metrics${agentIdQuery}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = data?.metrics || {
    callsConnected: 45,
    queueWaitTime: '01:15',
    ticketsResolved: 12,
    queueCalls: 3,
    ticketsRaised: 18
  };

  const sentiment = data?.customerFeedback || { positive: 75, neutral: 15, negative: 10 };
  const totalSentiment = sentiment.positive + sentiment.neutral + sentiment.negative || 100;

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  const getCallIcon = (callStatus: string, direction?: string) => {
    if (callStatus === 'missed') return <PhoneMissed className="w-4 h-4 text-rose-500" />;
    if (direction === 'outbound') return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
    return <PhoneIncoming className="w-4 h-4 text-emerald-500" />;
  };

  return (
    <div className="flex-1 p-6 h-full flex flex-col overflow-y-auto custom-scrollbar bg-[#000]">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome back, {userName}! Let's accomplish your tasks.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-2 bg-[#111] border border-[#222] hover:bg-[#1a1a1a] px-4 py-2.5 rounded-xl transition-all shadow-inner shadow-black/50"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${currentStatus.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
              <span className="text-sm font-bold text-white">{currentStatus.label}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {isStatusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStatusDropdownOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-[#222] rounded-xl shadow-xl overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(s.value)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a1a] transition-colors text-sm ${useCallStore.getState().baseStatus === s.value ? 'bg-[#1a1a1a] text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <span className="font-bold">{s.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button onClick={() => setIsCreateTicketModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all text-sm font-bold border border-primary/20">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Ticket</span>
          </button>
        </div>
      </div>

      {/* TOP METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Metric 1: Total Calls Connected (Solid) */}
        <Link href="/agent/call-center" className="bg-gradient-to-br from-orange-600 to-primary rounded-xl p-5 shadow-[0_4px_20px_rgba(234,88,12,0.3)] relative overflow-hidden group block cursor-pointer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-sm font-medium text-white/90">Calls Connected</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold text-white mb-2">{data?.metrics?.connectedCalls || 45}</p>
            <div className="flex items-center gap-1.5 bg-white/10 w-fit px-2 py-1 rounded text-[10px] font-bold text-white">
              <ArrowUpRight className="w-3 h-3" /> Increased from last week
            </div>
          </div>
        </Link>

        {/* Metric 2: Queue Calls (Glassy) */}
        <Link href="/agent/call-center" className="bg-[#050505] border border-[#222] rounded-xl p-5 hover:border-[#333] transition-colors group relative overflow-hidden block cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-sm font-medium text-slate-400">Queue Calls</span>
            <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center group-hover:border-slate-500 transition-colors bg-[#111]">
              <Users className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold text-white mb-2">{data?.metrics?.queueCalls || 3}</p>
            <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] w-fit px-2 py-1 rounded text-[10px] font-bold text-amber-500">
              <ArrowDownRight className="w-3 h-3" /> Monitor wait times
            </div>
          </div>
        </Link>

        {/* Metric 3: Tickets Raised */}
        <div className="bg-[#050505] border border-[#222] rounded-xl p-5 hover:border-[#333] transition-colors group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-sm font-medium text-slate-400">Tickets Raised</span>
            <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center group-hover:border-slate-500 transition-colors bg-[#111]">
              <Ticket className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold text-white mb-2">{data?.metrics?.assignedTickets || 18}</p>
            <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] w-fit px-2 py-1 rounded text-[10px] font-bold text-rose-500">
              <ArrowUpRight className="w-3 h-3" /> Action required
            </div>
          </div>
        </div>

        {/* Metric 4: Unread Messages */}
        <Link href="/agent/omnichannel" className="bg-[#050505] border border-[#222] rounded-xl p-5 hover:border-[#333] transition-colors group relative overflow-hidden block cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-sm font-medium text-slate-400">Unread Messages</span>
            <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center group-hover:border-slate-500 transition-colors bg-[#111]">
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold text-white mb-2">{data?.metrics?.unreadMessages || 12}</p>
            <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] w-fit px-2 py-1 rounded text-[10px] font-bold text-emerald-500">
              <CheckCircle2 className="w-3 h-3" /> Inbox overview
            </div>
          </div>
        </Link>

      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Customer Feedback Analytics (Span 8) */}
        <div className="lg:col-span-8 bg-[#050505] border border-[#222] rounded-xl p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Customer Sentiment Analytics</h3>
              <p className="text-xs text-slate-500">AI analysis of customer satisfaction from recent connected calls.</p>
            </div>
            <select className="bg-[#111] border border-[#222] text-white text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Custom Horizontal Stacked Bar representing Sentiment */}
            <div className="w-full h-8 rounded-full flex overflow-hidden mb-8 shadow-inner shadow-black/50">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(sentiment.positive / totalSentiment) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-amber-500 transition-all duration-1000" 
                style={{ width: `${(sentiment.neutral / totalSentiment) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${(sentiment.negative / totalSentiment) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-emerald-500 mb-1">{sentiment.positive}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Positive</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-amber-500 mb-1">{sentiment.neutral}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Neutral</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-rose-500 mb-1">{sentiment.negative}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Negative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Past Calls List (Span 4) */}
        <div className="lg:col-span-4 bg-[#050505] border border-[#222] rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Past Calls</h3>
            <button className="text-xs font-bold text-primary hover:text-orange-600 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-colors">
              + New
            </button>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {data?.pastCalls?.length > 0 ? (
              data.pastCalls.map((call: any) => (
                <div key={call.id} className="flex items-center gap-3 p-3 bg-[#111] border border-[#222] hover:border-[#333] rounded-xl transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                    {getCallIcon(call.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                      {call.customer?.name || call.customer?.phone}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Dur: {call.duration}s</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg hover:bg-[#222] flex items-center justify-center transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">No recent calls found.</div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Transfer Call Widget (Span 12) */}
        <div className="lg:col-span-12 bg-[#050505] border border-[#222] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white">Transfer Call Directory</h3>
              <p className="text-xs text-slate-500 mt-1">Select an active agent to transfer your current customer.</p>
            </div>
            <button className="text-sm font-medium text-slate-400 border border-[#333] hover:bg-[#111] hover:text-white px-4 py-2 rounded-xl transition-colors">
              View All Departments
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
            {data?.onlineAgents?.length > 0 ? (
              data.onlineAgents.map((agent: any) => (
                <div key={agent.id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-primary/50 transition-colors group flex flex-col items-center text-center cursor-pointer">
                  <div className="relative mb-3">
                    {agent.avatarUrl ? (
                        <img src={agent.avatarUrl} alt={agent.name} className="w-14 h-14 rounded-full border border-[#333] object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="w-14 h-14 rounded-full border border-[#333] bg-[#1a1a1a] flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                          <UserRound className="w-6 h-6" />
                        </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-[#111] ${
                      agent.status === 'AVAILABLE' ? 'bg-emerald-500' : 
                      agent.status === 'BUSY' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1 truncate w-full">{agent.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4 truncate w-full">{agent.department || 'General'}</p>
                  
                  <button onClick={() => {
                    setSelectedTransferAgent({ name: agent.name, department: agent.department || 'General' });
                    setIsTransferModalOpen(true);
                  }} className="w-full text-xs font-bold py-2 bg-[#1a1a1a] text-slate-300 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors border border-[#222] group-hover:border-primary">
                    Transfer
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-sm text-slate-500 text-center py-8 bg-[#111] rounded-xl border border-[#222]">
                No agents currently online for transfer.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      {isCreateTicketModalOpen && (
        <CreateTicketModal 
          onClose={() => setIsCreateTicketModalOpen(false)} 
          onSuccess={() => setIsCreateTicketModalOpen(false)} 
        />
      )}

      {isTransferModalOpen && selectedTransferAgent && (
        <TransferCallModal
          agentName={selectedTransferAgent.name}
          department={selectedTransferAgent.department}
          onClose={() => setIsTransferModalOpen(false)}
          onSuccess={() => setIsTransferModalOpen(false)}
        />
      )}
    </div>
  );
}
