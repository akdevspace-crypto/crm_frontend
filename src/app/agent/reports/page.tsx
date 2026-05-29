"use client";

import React from 'react';
import { FileText, BarChart, TrendingUp, Search } from 'lucide-react';

export default function AgentReports() {
  return (
    <div className="flex-1 p-6 h-full flex flex-col overflow-y-auto custom-scrollbar relative">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <FileText className="text-primary w-6 h-6" /> My Performance Reports
          </h1>
          <p className="text-sm text-slate-500">Analytics and KPIs based on your recent activity.</p>
        </div>
      </header>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl flex-1 flex flex-col p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Calls Handled', 'Avg Response Time', 'Resolution Rate'].map((metric, i) => (
             <div key={i} className="p-5 border border-[#222] rounded-xl bg-[#050505] flex flex-col justify-center">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">{metric}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">0</h3>
                  <span className="text-xs text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +0%</span>
                </div>
             </div>
          ))}
        </div>

        <div className="flex-1 border border-[#222] rounded-xl bg-[#050505] flex flex-col items-center justify-center p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#111] flex items-center justify-center border border-[#222] mb-4">
            <BarChart className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Not Enough Data</h3>
          <p className="text-slate-500 max-w-md text-center text-sm">
            Complete a few shifts and handle more interactions to start seeing beautiful analytical charts here.
          </p>
        </div>
      </div>
    </div>
  );
}
