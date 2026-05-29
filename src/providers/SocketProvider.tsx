"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useConversationStore } from '@/store/conversationStore';
import { useCallStore, CallState } from '@/store/useCallStore';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

interface SocketContextProps {
  socket: Socket | null;
  telephonySocket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  telephonySocket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

// Global singleton instance to prevent multiple socket connections
let globalSocket: Socket | null = null;
let globalTelephonySocket: Socket | null = null;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [telephonySocket, setTelephonySocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
      }
      if (globalTelephonySocket) {
        globalTelephonySocket.disconnect();
        globalTelephonySocket = null;
      }
      return;
    }

    if (!globalSocket) {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      globalSocket = io(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "4000") : "http://" + window.location.hostname + ":4000") : "http://localhost:4000"}`, {
        path: '/socket.io',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        auth: {
          agentId: user.id,
        }
      });
    }

    if (!globalTelephonySocket) {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      globalTelephonySocket = io(`${typeof window !== "undefined" ? (window.location.hostname.includes("devtunnels.ms") ? "https://" + window.location.hostname.replace("3000", "3005") : "http://" + window.location.hostname + ":3005") : "https://b5tvsxt0-3005.inc1.devtunnels.ms"}`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        auth: {
          agentId: user.id,
        }
      });
    }

    const socketInstance = globalSocket;
    const telephonySocketInstance = globalTelephonySocket;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Connected to Express Backend via WebSockets');
      socketInstance.emit('agent_login', {
        agentId: user.id,
        name: user.name || user.email,
        department: user.department || 'General'
      });
    };

    const handleTelephonyConnect = () => {
      console.log('Connected to NestJS Telephony Backend via WebSockets');
      telephonySocketInstance.emit('agent_login', {
        agentId: user.id,
        name: user.name || user.email,
        department: user.department || 'General'
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSockets');
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    telephonySocketInstance.on('connect', handleTelephonyConnect);

    if (socketInstance.connected) {
      setIsConnected(true);
      socketInstance.emit('agent_login', {
        agentId: user.id,
        name: user.name || user.email,
        department: user.department || 'General'
      });
    }

    if (telephonySocketInstance.connected) {
      telephonySocketInstance.emit('agent_login', {
        agentId: user.id,
        name: user.name || user.email,
        department: user.department || 'General'
      });
    }

    const handleNewWhatsAppMessage = (payload: any) => useConversationStore.getState().handleIncomingMessage(payload);
    const handleNewEmailMessage = (payload: any) => useConversationStore.getState().handleIncomingMessage(payload);
    const handleCustomerTyping = (data: any) => useConversationStore.getState().setTypingStatus(data.conversationId, data.isTyping);
    const handleInstagramProfileUpdated = (payload: any) => {
      console.log('socket event: instagram_profile_updated', payload);
      useConversationStore.getState().updateCustomerIdentity(payload);
    };
    const handleCustomerIdentityUpdated = (payload: any) => {
      console.log('socket event: customer_identity_updated', payload);
      useConversationStore.getState().updateCustomerIdentity(payload);
    };

    // Unified entrypoint for all Omnichannel events matching `{ conversation, message, customer }`
    const handleNewMessage = (payload: any) => {
      console.log('General new_message received:', payload);
      if (payload.conversation && payload.message && payload.customer) {
        useConversationStore.getState().handleIncomingMessage(payload);
      } else if (payload.conversationId && payload.message) {
        useConversationStore.getState().addMessage(payload.conversationId, payload.message);
      }
    };

    const handleConversationUpdated = (conv: any) => {
      console.log('Conversation updated:', conv);
      // Refresh conversations to reflect latest unread counts and status
      useConversationStore.getState().fetchConversations();
    };

    const handleIncomingCall = (data: any) => {
      console.log('Incoming WebRTC Call:', data);
      const { status, fetchDashboardCalls } = useCallStore.getState();
      
      // Update dashboard real-time data
      fetchDashboardCalls();

      if (status === 'AVAILABLE') {
        useCallStore.getState().setIncomingCall(data);
      } else {
        console.log('Agent is not available, ignoring call.');
      }
    };

    const handleIncomingEmergencyCall = (data: any) => {
      console.log('Incoming EMERGENCY WebRTC Call:', data);
      useCallStore.getState().setIncomingCall(data);
    };

    const handleAgentAssigned = (data: any) => {
      const { incomingCall } = useCallStore.getState();
      if (incomingCall && incomingCall.callSid === data.callSid) {
        useCallStore.getState().setIncomingCall(null);
      }
    };

    const handleCallEnded = (data: any) => {
      console.log('Call ended', data);
      const { setIncomingCall, setWebrtcConnected, fetchDashboardCalls } = useCallStore.getState();
      setIncomingCall(null);
      setWebrtcConnected(false);
      fetchDashboardCalls();
    };

    const handleCallRejected = (data: any) => {
      console.log('Call rejected', data);
      const { setIncomingCall, fetchDashboardCalls } = useCallStore.getState();
      setIncomingCall(null);
      fetchDashboardCalls();
    };

    useCallStore.subscribe((state, prevState) => {
      if (state.status !== prevState.status && socketInstance.connected) {
        socketInstance.emit('status_update', { status: state.status });
      }
    });

    const handleAnalyticsUpdate = (data: any) => useAnalyticsStore.getState().setMetrics(data);

    const handleAiAnalysisUpdated = (data: any) => {
      console.log('AI Analysis Updated:', data);
      const store = useConversationStore.getState();
      if (store.activeCustomerProfile?.id === data.customerId) {
        store.fetchCustomerProfile(data.customerId);
      }
    };

    // Attach listeners
    socketInstance.on('new_whatsapp_message', handleNewWhatsAppMessage);
    socketInstance.on('new_email_message', handleNewEmailMessage);
    socketInstance.on('instagram_profile_updated', handleInstagramProfileUpdated);
    socketInstance.on('customer_identity_updated', handleCustomerIdentityUpdated);
    socketInstance.on('customer_typing', handleCustomerTyping);
    socketInstance.on('new_message', handleNewMessage);
    socketInstance.on('conversationUpdated', handleConversationUpdated);
    socketInstance.on('analyticsUpdate', handleAnalyticsUpdate);
    socketInstance.on('ai_analysis_updated', handleAiAnalysisUpdated);

    // Telephony specific listeners attached to NestJS socket
    telephonySocketInstance.on('incoming_call', handleIncomingCall);
    telephonySocketInstance.on('incomingEmergencyCall', handleIncomingEmergencyCall);
    telephonySocketInstance.on('agentAssigned', handleAgentAssigned);
    telephonySocketInstance.on('callEnded', handleCallEnded);
    telephonySocketInstance.on('callRejected', handleCallRejected);
    telephonySocketInstance.on('agent_status_change', (data) => console.log('agent status changed', data));
    
    // Initial fetch for dashboard calls
    useCallStore.getState().fetchDashboardCalls();

    setSocket(socketInstance);
    setTelephonySocket(telephonySocketInstance);

    // Fallback Polling Mechanism in case WebSockets are delayed by proxies/Ngrok
    const pollInterval = setInterval(async () => {
      const { status, incomingCall, setIncomingCall } = useCallStore.getState();
      if (status === 'AVAILABLE' && !incomingCall && user?.id) {
        try {
          const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
          const apiUrl = window.location.hostname.includes('devtunnels.ms') 
            ? `https://${window.location.hostname.replace('3000', '3005')}/exotel/my-ringing-call?agentId=${user.id}`
            : `http://${hostname}:3005/exotel/my-ringing-call?agentId=${user.id}`;
            
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.call) {
              console.log('Polling found incoming call:', data.call);
              setIncomingCall(data.call);
            }
          }
        } catch (e) {
          // Ignore fetch errors during polling
        }
      }
    }, 1500);

    // Clean up event listeners on unmount (prevent duplication on re-renders)
    return () => {
      clearInterval(pollInterval);
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('new_whatsapp_message', handleNewWhatsAppMessage);
      socketInstance.off('new_email_message', handleNewEmailMessage);
      socketInstance.off('instagram_profile_updated', handleInstagramProfileUpdated);
      socketInstance.off('customer_identity_updated', handleCustomerIdentityUpdated);
      socketInstance.off('customer_typing', handleCustomerTyping);
      socketInstance.off('new_message', handleNewMessage);
      socketInstance.off('conversationUpdated', handleConversationUpdated);
      socketInstance.off('analyticsUpdate', handleAnalyticsUpdate);
      socketInstance.off('ai_analysis_updated', handleAiAnalysisUpdated);

      telephonySocketInstance.off('connect', handleTelephonyConnect);
      telephonySocketInstance.off('incoming_call', handleIncomingCall);
      telephonySocketInstance.off('incomingEmergencyCall', handleIncomingEmergencyCall);
      telephonySocketInstance.off('agentAssigned', handleAgentAssigned);
      telephonySocketInstance.off('callEnded', handleCallEnded);
      telephonySocketInstance.off('callRejected', handleCallRejected);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, telephonySocket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
