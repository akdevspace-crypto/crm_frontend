import React from 'react';
import { Phone, Clock, Users, Play } from 'lucide-react';

interface ContactCenterDashboardProps {
  metrics: any;
  totalAgents: number;
}

export function ContactCenterDashboard({ metrics, totalAgents }: ContactCenterDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Real-time stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Live Active Calls</span>
            <span className="text-3xl font-extrabold text-white block mt-1">4</span>
          </div>
          <Phone className="w-8 h-8 text-orange-500" />
        </div>
        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Waiting in Queue</span>
            <span className="text-3xl font-extrabold text-white block mt-1">2</span>
          </div>
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available Agents</span>
            <span className="text-3xl font-extrabold text-white block mt-1">{totalAgents}</span>
          </div>
          <Users className="w-8 h-8 text-emerald-500" />
        </div>
      </div>

      {/* Call monitor list */}
      <div className="bg-[#0b0b0b] border border-[#1e1e1e] p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-1.5"><Play className="w-4 h-4 text-orange-500" /> Live Agent Call Monitoring Panel</h3>
        <div className="divide-y divide-[#1c1c1c]/50">
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold">Raghav</span>
            </div>
            <span className="text-slate-400">Call Connected (04:12 mins)</span>
            <button className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#222] rounded-lg font-bold text-[10px] uppercase text-orange-500">Listen</button>
          </div>
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold">Agent Smith</span>
            </div>
            <span className="text-slate-400">Available</span>
            <span className="text-slate-600 text-[10px]">Standby</span>
          </div>
        </div>
      </div>
    </div>
  );
}
