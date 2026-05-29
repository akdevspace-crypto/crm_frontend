"use client";

import { Phone, Users, LayoutDashboard, MessageSquare, FileText, Settings, HeartPulse, Activity } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { status, setStatus } = useCallStore();

  const getStatusColor = () => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'BUSY': return 'bg-amber-500 shadow-amber-500/50';
      case 'ON_CALL': return 'bg-rose-500 shadow-rose-500/50';
      case 'WRAP_UP': return 'bg-purple-500 shadow-purple-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Phone, label: 'Call Center', active: false },
    { icon: MessageSquare, label: 'Omnichannel', active: false },
    { icon: Users, label: 'Customers', active: false },
    { icon: HeartPulse, label: 'Care Plans', active: false },
    { icon: Activity, label: 'Emergency Alerts', active: false, alert: true },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-72 h-screen border-r border-border bg-card flex flex-col pt-6 pb-4">
      {/* Brand */}
      <div className="px-6 flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
          <HeartPulse className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">ElderCare</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">CRM Platform</p>
        </div>
      </div>

      {/* Agent Status Component */}
      <div className="px-6 mb-8">
        <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Agent Status</span>
            <div className="relative flex items-center justify-center">
              <span className={`w-3 h-3 rounded-full shadow-lg ${getStatusColor()}`}></span>
              {status !== 'OFFLINE' && (
                <span className={`absolute w-3 h-3 rounded-full animate-ping opacity-75 ${getStatusColor()}`}></span>
              )}
            </div>
          </div>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          >
            <option value="AVAILABLE">🟢 Available</option>
            <option value="BUSY">🟠 Busy (Break)</option>
            <option value="ON_CALL">🔴 On Call</option>
            <option value="WRAP_UP">🟣 Wrap Up</option>
            <option value="OFFLINE">⚫ Offline</option>
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item, i) => (
          <button 
            key={i}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground'}`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
            <span className="font-medium">{item.label}</span>
            {item.alert && (
              <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>
        ))}
      </div>
      
      {/* User Profile */}
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
          <img src="https://ui-avatars.com/api/?name=Agent+Smith&background=0D8ABC&color=fff" alt="User" className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700" />
          <div className="text-left flex-1">
            <p className="text-sm font-bold">Agent Smith</p>
            <p className="text-xs text-slate-500">Tier 2 Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
