import React from 'react';
import { BarChart3, PieChart, LineChart, Download, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Reports | ElderCare CRM',
};

export default function ReportsPage() {
  return (
    <div className="flex-1 p-6 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <BarChart3 className="text-primary w-6 h-6" /> Advanced Reports
          </h1>
          <p className="text-sm text-slate-500">Historical data and operational intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] text-slate-300 rounded-lg hover:text-white transition-colors text-sm">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#050505] border border-[#222] h-80 rounded-xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Call Volume by Channel</h3>
            <LineChart className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex-1 border border-dashed border-[#333] rounded-lg flex items-center justify-center text-slate-500 text-sm">
            [ Line Chart Visualization Placeholder ]
          </div>
        </div>
        <div className="bg-[#050505] border border-[#222] h-80 rounded-xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Issue Resolution Breakdown</h3>
            <PieChart className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex-1 border border-dashed border-[#333] rounded-lg flex items-center justify-center text-slate-500 text-sm">
            [ Donut Chart Visualization Placeholder ]
          </div>
        </div>
      </div>

      <div className="bg-[#050505] border border-[#222] rounded-xl p-5">
        <h3 className="font-bold text-white mb-4">Agent Performance Matrix</h3>
        <div className="border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] border-b border-[#222] text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Agent Name</th>
                <th className="px-4 py-3 font-semibold">Calls Handled</th>
                <th className="px-4 py-3 font-semibold">Avg Handle Time</th>
                <th className="px-4 py-3 font-semibold">CSAT Score</th>
                <th className="px-4 py-3 font-semibold">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-slate-300">
              {/* Empty Data Placeholder */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
