"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SocketProvider } from "@/providers/SocketProvider";
import { IncomingCallModal } from "@/components/call-center/IncomingCallModal";
import { LiveCallPanel } from "@/components/call-center/LiveCallPanel";
import { AgentSidebar } from "@/components/agent-layout/AgentSidebar";
import { AgentNavbar } from "@/components/agent-layout/AgentNavbar";
import { useAuthStore } from "@/store/authStore";
import { AdminTicketToast } from "@/components/tickets/AdminTicketToast";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    const userStr = localStorage.getItem("crm_user");
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        useAuthStore.getState().setUser(user);
      } catch (e) {}
    }

    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (token && pathname === "/login") {
      let role = 'ADMIN';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          role = user.role || 'ADMIN';
        } catch (e) {}
      }
      
      if (role === 'AGENT') {
        router.push("/agent/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else if (token && pathname !== "/login") {
      let role = 'ADMIN';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          role = user.role || 'ADMIN';
        } catch (e) {}
      }
      
      const isAgentPortalPath = pathname === '/agent' || pathname.startsWith('/agent/');
      if (role === 'AGENT' && !isAgentPortalPath) {
        router.push('/agent/dashboard');
      } else if (role !== 'AGENT' && isAgentPortalPath) {
        router.push('/dashboard');
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#000] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
    </div>;
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const isAgentPortal = pathname === '/agent' || pathname.startsWith('/agent/');

  return (
    <SocketProvider>
      <div className="flex h-screen overflow-hidden">
        {isAgentPortal ? <AgentSidebar /> : <Sidebar />}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {isAgentPortal ? <AgentNavbar /> : <Navbar />}
          <main className="flex-1 overflow-y-auto bg-[#000] relative">
            {children}
          </main>
        </div>
      </div>
      <IncomingCallModal />
      <LiveCallPanel />
      <AdminTicketToast />
    </SocketProvider>
  );
}
