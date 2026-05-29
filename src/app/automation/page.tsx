import React from 'react';
import { Settings, Play, Pause, Zap, Workflow } from 'lucide-react';

export const metadata = {
  title: 'Automation | ElderCare CRM',
};

export default function AutomationPage() {
  const workflows: any[] = [];

  return (
    <div className="flex-1 p-6 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Workflow className="text-primary w-6 h-6" /> Automation Workflows
          </h1>
          <p className="text-sm text-slate-500">Create rules to automate repetitive tasks and routing</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm">
          Create Workflow
        </button>
      </header>

      <div className="bg-[#050505] border border-[#222] rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="space-y-4">
            {workflows.map((wf, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] p-4 rounded-xl flex items-center justify-between hover:border-[#333] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${wf.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-[#222] text-slate-500'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{wf.name}</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">Trigger: <strong className="text-slate-300 font-medium">{wf.trigger}</strong></span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-500">Action: <strong className="text-slate-300 font-medium">{wf.action}</strong></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                    wf.status === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-slate-500 border-[#333] bg-[#222]'
                  }`}>
                    {wf.status}
                  </span>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-[#222] text-slate-300 hover:text-white rounded-lg transition-colors">
                      {wf.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 bg-[#222] text-slate-300 hover:text-white rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
