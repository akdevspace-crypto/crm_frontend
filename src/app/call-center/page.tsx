"use client";

import React, { useState, useEffect } from 'react';
import { Users, Phone, PhoneOutgoing, Video, ShieldCheck } from "lucide-react";
import { useCallStore } from "@/store/useCallStore";
import { CallWidget } from "@/components/call-center/CallWidget";

interface Agent {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  department: string;
}

export default function CallCenterPage() {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setActiveCall } = useCallStore();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const res = await fetch(`https://crm-files.onrender.com/api/v1/agents`);
        if (res.ok) {
          const data = await res.json();
          setAgents(data.agents || []);
        }
      } catch (err) {
        console.error("Failed to fetch agents", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleWebRtcCall = (agent: Agent) => {
    setActiveCall({
      callSid: `room_${agent.id.substring(0, 8)}`,
      customerName: agent.name,
      phone: 'Internal',
      urgency: 'NORMAL',
      category: agent.department,
      isCaller: true
    });
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Call Center</h1>
          <p className="text-slate-500 mt-1">Manage active WebRTC calls, queue board, and live interactions.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#111] border border-[#222] rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('inbound')}
            className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'inbound' ? 'bg-[#222] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Phone className="w-4 h-4" /> Inbound
          </button>
          <button 
            onClick={() => setActiveTab('outbound')}
            className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'outbound' ? 'bg-[#222] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <PhoneOutgoing className="w-4 h-4" /> Outbound
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Side: Dynamic Content based on Tab */}
        <div className="w-1/2 flex flex-col bg-[#050505] border border-[#222] rounded-2xl shadow-lg overflow-hidden">
          {activeTab === 'inbound' ? (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b border-[#222] bg-[#0a0a0a]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Internal Directory
                </h2>
                <p className="text-xs text-slate-500 mt-1">Staff, Admins, and Super Admins</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full text-slate-500">
                    <div className="w-5 h-5 border-2 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex justify-between items-center p-4 bg-[#111] border border-[#222] rounded-xl hover:border-[#333] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {agent.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              {agent.name}
                              {(agent.role === 'ADMIN' || agent.role === 'SUPER_ADMIN') && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 capitalize">
                              {agent.role ? agent.role.replace('_', ' ') : 'Agent'} • {agent.department || 'General'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {agent.status}
                          </span>
                          <button 
                            onClick={() => handleWebRtcCall(agent)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-lg transition-colors"
                            title="Call via WebRTC"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <PhoneOutgoing className="w-12 h-12 text-slate-600 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Outbound Dialer</h2>
              <p className="text-sm text-slate-500 max-w-sm">Enter a customer phone number to initiate an outbound WebRTC SIP call.</p>
              <div className="mt-8 flex gap-2 w-full max-w-xs">
                <input type="text" placeholder="+91..." className="flex-1 bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">Dial</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active WebRTC Phone System */}
        <div className="w-1/2 flex flex-col bg-[#050505] border border-[#222] rounded-2xl shadow-lg p-8 items-center justify-center">
          <CallWidget />
        </div>
      </div>
    </div>
  );
}
