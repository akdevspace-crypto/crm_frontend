import React from 'react';
import { Activity, Sparkles, Brain, FileText, Download } from 'lucide-react';

export const metadata = {
  title: 'AI Call Summary | ElderCare CRM',
};

export default function AICallSummaryPage() {
  const summaries: any[] = [];

  return (
    <div className="flex-1 p-6 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="text-primary w-6 h-6" /> AI Call Summaries
          </h1>
          <p className="text-sm text-slate-500">Automated transcriptions and sentiment analysis from recent calls</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] text-white rounded-lg hover:bg-[#222] transition-colors text-sm font-medium">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#050505] border border-[#222] p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg"><Brain className="w-5 h-5 text-primary" /></div>
            <h3 className="text-slate-400 font-medium text-sm">Calls Analyzed (30d)</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">0</p>
          <p className="text-xs text-emerald-500 mt-2">+0% vs last month</p>
        </div>
        <div className="bg-[#050505] border border-[#222] p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg"><Activity className="w-5 h-5 text-purple-500" /></div>
            <h3 className="text-slate-400 font-medium text-sm">Avg Sentiment Score</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">0.0 / 10</p>
          <p className="text-xs text-emerald-500 mt-2">+0.0 improvement</p>
        </div>
        <div className="bg-[#050505] border border-[#222] p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg"><FileText className="w-5 h-5 text-amber-500" /></div>
            <h3 className="text-slate-400 font-medium text-sm">Time Saved (Est.)</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">0 hrs</p>
          <p className="text-xs text-slate-500 mt-2">Via auto-note generation</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Recent AI Summaries</h2>
      <div className="grid grid-cols-1 gap-4">
        {summaries.map(summary => (
          <div key={summary.id} className="bg-[#050505] border border-[#222] p-5 rounded-xl hover:border-[#333] transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">{summary.customer}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{summary.date}</span>
                  <span>•</span>
                  <span>{summary.duration}</span>
                  <span>•</span>
                  <span>{summary.agent}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded border ${
                summary.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                summary.sentiment === 'Frustrated' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                'bg-[#222] text-slate-300 border-[#333]'
              }`}>
                {summary.sentiment}
              </span>
            </div>
            
            <div className="bg-[#111] border border-[#222] p-4 rounded-lg mb-4 text-sm text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Summary:</strong> Customer called to inquire about their recent billing statement. They were initially confused about a late charge, but after explanation, the issue was resolved. Scheduled a follow-up call for next month.
            </div>

            <div className="flex gap-2">
              {summary.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-[#222] text-slate-300 text-[10px] uppercase font-bold tracking-wider rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
