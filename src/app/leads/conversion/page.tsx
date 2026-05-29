"use client";

import React, { useEffect } from 'react';
import { useLeadStore } from '@/store/useLeadStore';
import { Calendar, Phone, Activity, MoreVertical } from 'lucide-react';

const KANBAN_COLUMNS = [
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
  { id: 'FOLLOWUP_REQUIRED', label: 'Follow Up', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
  { id: 'POSITIVE', label: 'Positive', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
  { id: 'NEGATIVE', label: 'Negative', color: 'border-rose-500/50 bg-rose-500/10 text-rose-400' },
  { id: 'CONVERTED', label: 'Converted', color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' },
];

export default function LeadConversionBoard() {
  const { leads, fetchLeads, updateLeadStatus } = useLeadStore();

  useEffect(() => {
    // Agent views their own leads (or Admin views all)
    fetchLeads('dummy-token');
  }, [fetchLeads]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, statusId: string) => {
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      await updateLeadStatus(leadId, statusId, 'Moved via Kanban', 'dummy-token');
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="h-full flex flex-col space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversion Board</h1>
          <p className="text-slate-400 text-sm mt-1">Manage lead statuses via drag and drop.</p>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {KANBAN_COLUMNS.map(column => (
            <div 
              key={column.id}
              className="w-80 shrink-0 flex flex-col bg-[#111] rounded-xl border border-[#222]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 border-b border-[#222] flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${column.color}`}>
                  {column.label}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {leads.filter(l => l.status === column.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {leads.filter(l => l.status === column.id).map(lead => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-[#1a1a1a] border border-[#333] hover:border-[#555] rounded-lg p-4 cursor-grab active:cursor-grabbing transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{lead.customerName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{lead.serviceInterest || 'General Inquiry'}</p>
                      </div>
                      <button className="text-slate-500 hover:text-slate-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.phoneNumber}
                      </div>
                      
                      {lead.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">@</span>
                          {lead.email}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <div className="w-4 h-4 rounded-full bg-[#333] flex items-center justify-center text-[8px] font-bold">
                          {lead.agentName?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-slate-300">
                          Handled by {lead.agentName || 'Unknown'}
                        </span>
                      </div>
                      
                      {lead.conversionScore && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Activity className="w-3.5 h-3.5" />
                          <span className={lead.conversionScore > 70 ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                            {lead.conversionScore}% Conversion Probability
                          </span>
                        </div>
                      )}
                      
                      {lead.nextFollowup ? (
                        <div className="flex items-center gap-2 text-xs text-amber-500 mt-2 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 w-fit">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.nextFollowup).toLocaleDateString()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
