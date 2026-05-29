import React from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Key, Globe } from 'lucide-react';

export const metadata = {
  title: 'Settings | ElderCare CRM',
};

export default function SettingsPage() {
  return (
    <div className="flex-1 p-6 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <SettingsIcon className="text-primary w-6 h-6" /> System Settings
          </h1>
          <p className="text-sm text-slate-500">Configure your workspace and integrations</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm">
          Save Changes
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Settings Nav */}
        <div className="w-64 bg-[#050505] border border-[#222] rounded-xl p-4 shrink-0 flex flex-col gap-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#111] text-white border border-[#333] rounded-lg text-sm font-medium transition-colors">
            <User className="w-4 h-4 text-primary" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-[#111] rounded-lg text-sm font-medium transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-[#111] rounded-lg text-sm font-medium transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-[#111] rounded-lg text-sm font-medium transition-colors">
            <Key className="w-4 h-4" /> API Keys
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-[#111] rounded-lg text-sm font-medium transition-colors">
            <Globe className="w-4 h-4" /> Integrations
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#050505] border border-[#222] rounded-xl overflow-y-auto custom-scrollbar p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-[#222] pb-4">Profile Information</h2>
          
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-[#111]">
                AS
              </div>
              <div>
                <button className="px-4 py-2 bg-[#111] border border-[#333] text-white text-sm font-medium rounded-lg hover:bg-[#222] transition-colors mb-2">
                  Change Avatar
                </button>
                <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                <input type="text" defaultValue="Firstname" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                <input type="text" defaultValue="Lastname" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue="name@eldercare.com" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Department</label>
              <select className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-colors appearance-none">
                <option>Tier 2 Support</option>
                <option>Tier 1 Support</option>
                <option>Management</option>
              </select>
            </div>
            
            <div className="pt-6 border-t border-[#222]">
              <h3 className="font-bold text-white mb-2">Danger Zone</h3>
              <p className="text-xs text-slate-500 mb-4">Permanently delete your account and all associated data.</p>
              <button className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-sm font-medium rounded-lg hover:bg-rose-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
