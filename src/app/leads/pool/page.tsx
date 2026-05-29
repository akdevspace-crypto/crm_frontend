"use client";

import React, { useEffect, useState } from 'react';
import { useLeadStore } from '@/store/useLeadStore';
import { useCallStore } from '@/store/useCallStore';
import { ManualLeadEntryModal } from '@/components/leads/ManualLeadEntryModal';
import { Phone, Users, Calendar, AlertCircle, Filter, Search, UploadCloud, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LeadPoolPage() {
  const { leads, fetchLeads, claimLead, isLoading } = useLeadStore();
  const { setActiveCall } = useCallStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  
  useEffect(() => {
    // In real app, get token from AuthContext/localStorage
    fetchLeads('dummy-token', '');
  }, [fetchLeads]);

  const handleClaim = async (leadId: string) => {
    // Dynamically retrieve the logged-in user's agentId
    let agentId = null;
    try {
      const stored = localStorage.getItem('crm_user');
      if (stored) {
        agentId = JSON.parse(stored).agentId;
      }
    } catch (e) {}

    if (!agentId) {
      alert("Error: Agent profile not found. Please log out and log back in.");
      return;
    }

    const success = await claimLead(leadId, agentId);
    if (success) {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setActiveCall({
          callSid: `outbound-${Date.now()}`,
          phone: lead.phoneNumber,
          customerName: lead.customerName,
          category: 'Outbound',
          isCaller: true,
          status: 'RINGING',
          leadId: lead.id
        });
      }
      alert("Lead claimed! Initiating call...");
    } else {
      alert("Failed to claim lead. It might be locked by another agent.");
    }
  };

  const filteredLeads = leads.filter(l => 
    l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lead Data</h1>
            <p className="text-slate-400 text-sm mt-1">Manage, upload, and claim all leads in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsManualEntryOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Manual Entry
            </button>
            <Link href="/leads/upload">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-lg text-sm font-medium transition-colors">
                <UploadCloud className="w-4 h-4" />
                Upload Leads
              </button>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 bg-[#111] p-4 rounded-xl border border-[#222]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search leads..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] border-b border-[#222] text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Service Interest</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading leads...</td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No leads found in the pool.
                  </td>
                </tr>
              ) : filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 font-medium">{lead.customerName}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{lead.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                      {lead.serviceInterest || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-[#333]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {lead.status === 'NEW' ? (
                      <button 
                        onClick={() => handleClaim(lead.id)}
                        className="flex items-center gap-2 ml-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs">Claimed by {lead.agentName}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <ManualLeadEntryModal 
        isOpen={isManualEntryOpen} 
        onClose={() => setIsManualEntryOpen(false)} 
      />
    </div>
  );
}
