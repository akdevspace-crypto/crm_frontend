import { create } from 'zustand';

export interface CallData {
  callSid: string;
  phone: string;
  customerName?: string;
  category?: string;
  queueType?: string;
  emergencyFlag?: boolean;
  ivrInput?: string;
  status?: string;
  duration?: number;
  isCaller?: boolean;
  leadId?: string;
  accepted?: boolean;
  transcript?: string;
  roomName?: string;
  token?: string;
  customerContext?: any;
  urgency?: string;
}

export interface CallState {
  status: 'OFFLINE' | 'AVAILABLE' | 'BUSY' | 'ON_CALL' | 'WRAP_UP';
  baseStatus: string;
  incomingCall: CallData | null;
  activeCall: CallData | null;
  webrtcConnected: boolean;
  connectedAt: number | null;
  isMuted: boolean;
  isHold: boolean;
  queuedCalls: any[];
  missedCalls: any[];
  setStatus: (status: CallState['status']) => void;
  setBaseStatus: (status: string) => void;
  setIncomingCall: (call: CallData | null) => void;
  setActiveCall: (call: CallData | null) => void;
  setWebrtcConnected: (connected: boolean) => void;
  toggleMute: () => void;
  toggleHold: () => void;
  fetchDashboardCalls: () => Promise<void>;
}

export const useCallStore = create<CallState>((set) => ({
  status: 'AVAILABLE',
  baseStatus: 'AVAILABLE',
  incomingCall: null,
  activeCall: null,
  webrtcConnected: false,
  connectedAt: null,
  isMuted: false,
  isHold: false,
  queuedCalls: [],
  missedCalls: [],
  setStatus: (status) => set({ status }),
  setBaseStatus: (baseStatus) => set({ baseStatus }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  setActiveCall: (call) => set({ activeCall: call, connectedAt: null }), // reset timer on new call
  setWebrtcConnected: (connected) => set((state) => ({ 
    webrtcConnected: connected, 
    connectedAt: connected && !state.connectedAt ? Date.now() : state.connectedAt 
  })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleHold: () => set((state) => ({ isHold: !state.isHold })),
  fetchDashboardCalls: async () => {
    try {
      const baseUrl = typeof window !== 'undefined' 
        ? (window.location.hostname.includes('devtunnels.ms') 
            ? 'https://' + window.location.hostname.replace('3000', '3005') 
            : 'http://' + window.location.hostname + ':3005') 
        : 'https://b5tvsxt0-3005.inc1.devtunnels.ms';
      const res = await fetch(`${baseUrl}/exotel/dashboard-calls`);
      if (res.ok) {
        const data = await res.json();
        set({ queuedCalls: data.queuedCalls || [], missedCalls: data.missedCalls || [] });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard calls:', err);
    }
  },
}));
