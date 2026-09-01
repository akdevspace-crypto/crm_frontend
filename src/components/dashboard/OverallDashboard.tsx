"use client";

import React, { useState, useEffect } from 'react';
import { AdvancedKpiCards } from './AdvancedKpiCards';
import { PerformanceHeatmap } from './PerformanceHeatmap';
import { OmnichannelTrends } from './OmnichannelTrends';
import { AgentLeaderboard } from './AgentLeaderboard';
import { SlaGauge } from './SlaGauge';
import { CallVolumeHeatmap } from './CallVolumeHeatmap';
import { SentimentTrend } from './SentimentTrend';
import { RightSidebarPanels } from './RightSidebarPanels';

export function OverallDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('paramantra_access_token') || '';
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/agents/dashboard-metrics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.warn("Failed to load overall command center metrics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
        <span className="w-5 h-5 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mr-2.5"></span>
        Loading Command Center...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#000] text-white">
      <div className="flex h-full">
        {/* Main Dashboard Area */}
        <div className="flex-1 p-4 border-r border-[#222] relative">


          {/* KPI Grid (12 cards) */}
          <div className="mb-3">
            <AdvancedKpiCards data={data} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="md:col-span-2 bg-[#050505] border border-[#222] rounded-xl p-3 h-[250px]">
              <PerformanceHeatmap />
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-3 h-[250px]">
              <OmnichannelTrends />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="md:col-span-2 bg-[#050505] border border-[#222] rounded-xl p-3">
              <AgentLeaderboard />
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-3 flex flex-col justify-between">
              <SlaGauge />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 bg-[#050505] border border-[#222] rounded-xl p-3">
              <CallVolumeHeatmap />
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-3">
              <SentimentTrend data={data} />
            </div>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="w-[280px] p-4 hidden lg:block overflow-y-auto custom-scrollbar">
          <RightSidebarPanels />
        </div>
      </div>
    </div>
  );
}
export default OverallDashboard;
