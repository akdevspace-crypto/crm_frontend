"use client";

import { useCallStore } from '../store/useCallStore';
import { useAnalyticsStore } from '../store/useAnalyticsStore';
import { useEffect, useState } from 'react';

// Analytics Components
import { AdvancedKpiCards } from './dashboard/AdvancedKpiCards';
import { PerformanceHeatmap } from './dashboard/PerformanceHeatmap';
import { OmnichannelTrends } from './dashboard/OmnichannelTrends';
import { AgentLeaderboard } from './dashboard/AgentLeaderboard';
import { SlaGauge } from './dashboard/SlaGauge';
import { CallVolumeHeatmap } from './dashboard/CallVolumeHeatmap';
import { SentimentTrend } from './dashboard/SentimentTrend';
import { RightSidebarPanels } from './dashboard/RightSidebarPanels';

export function Dashboard() {
  const { metrics } = useAnalyticsStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const res = await fetch(`https://b5tvsxt0-4000.inc1.devtunnels.ms/api/v1/agents/dashboard-metrics`);
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        // Suppress console.error to avoid Next.js error overlay in dev
        console.warn("Failed to load dashboard metrics", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#000] text-white">
      <div className="flex h-full">
        {/* Main Dashboard Area */}
        <div className="flex-1 p-4 border-r border-[#222]">
          <header className="mb-3">
            <h1 className="text-xl font-bold text-white mb-0.5"> Command Center</h1>
            <p className="text-[10px] text-slate-500">Enterprise Analytics & Live Queue Monitoring</p>
          </header>

          {/* KPI Grid (12 cards) */}
          <div className="mb-3">
            <AdvancedKpiCards data={data} />
          </div>

          {/* Row 1 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
            <div className="lg:col-span-5">
              <PerformanceHeatmap />
            </div>
            <div className="lg:col-span-4">
              <OmnichannelTrends />
            </div>
            <div className="lg:col-span-3">
              <SlaGauge />
            </div>
          </div>

          {/* Row 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5">
              <CallVolumeHeatmap />
            </div>
            <div className="lg:col-span-4">
              <AgentLeaderboard />
            </div>
            <div className="lg:col-span-3">
              <SentimentTrend />
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="w-[260px] shrink-0 p-4 bg-[#050505]">
          <RightSidebarPanels />
        </div>
      </div>
    </div>
  );
}
