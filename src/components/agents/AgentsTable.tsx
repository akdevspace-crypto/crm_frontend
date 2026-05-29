import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Shield, Phone, MapPin, Eye, Clock, Users } from 'lucide-react';
import { EditAgentModal } from './EditAgentModal';
import { DeleteAgentModal } from './DeleteAgentModal';

interface AgentsTableProps {
  agents: any[];
  onRefresh: () => void;
}

export function AgentsTable({ agents, onRefresh }: AgentsTableProps) {
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [deletingAgent, setDeletingAgent] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Online</span>;
      case 'OFFLINE': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Offline</span>;
      case 'BUSY': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">Busy</span>;
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500 bg-[#111] uppercase border-b border-[#222] sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-semibold">Agent</th>
            <th className="px-6 py-4 font-semibold">Contact Info</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Joined / Active</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {agents.length > 0 ? agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-[#111] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={agent.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=0D8ABC&color=fff`} 
                    alt={agent.name} 
                    className="w-10 h-10 rounded-full border border-[#333]" 
                  />
                  <div>
                    <p className="font-bold text-white">{agent.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      {agent.employeeId || 'No Emp ID'}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400">
                <div className="space-y-1 text-xs">
                  <p className="text-slate-300">{agent.user?.email}</p>
                  {agent.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {agent.phone}</p>}
                  {agent.city && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {agent.city}, {agent.country}</p>}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-slate-300 text-xs font-medium bg-[#222] w-max px-2 py-1 rounded">
                  <Shield className="w-3 h-3 text-primary" />
                  {agent.user?.role || agent.department || 'AGENT'}
                </span>
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(agent.status)}
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Joined: {new Date(agent.joinedAt).toLocaleDateString()}</p>
                  <p className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" /> Last Active: {agent.lastActive ? new Date(agent.lastActive).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingAgent(agent)} className="p-2 border border-[#333] text-slate-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeletingAgent(agent)} className="p-2 border border-rose-500/30 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-16 text-slate-500">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 mb-4 text-slate-700 opacity-50" />
                  <p className="text-base font-medium text-white mb-1">No agents found</p>
                  <p className="text-sm">Click "Add Agent" to register a new user to the platform.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingAgent && (
        <EditAgentModal 
          agent={editingAgent} 
          onClose={() => setEditingAgent(null)} 
          onSuccess={() => {
            setEditingAgent(null);
            onRefresh();
          }} 
        />
      )}

      {deletingAgent && (
        <DeleteAgentModal 
          agent={deletingAgent} 
          onClose={() => setDeletingAgent(null)} 
          onSuccess={() => {
            setDeletingAgent(null);
            onRefresh();
          }} 
        />
      )}
    </>
  );
}
