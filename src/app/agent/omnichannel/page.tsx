"use client";

import React from 'react';
import { MessageSquare, Inbox, Search } from 'lucide-react';
import { ConversationSidebar } from '@/components/omnichannel/ConversationSidebar';
import { ConversationThread } from '@/components/omnichannel/ConversationThread';
import { Customer360Panel } from '@/components/omnichannel/Customer360Panel';

export default function AgentOmnichannel() {
  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#000]">
      {/* Inbox List */}
      <div className="w-80 border-r border-[#222] flex flex-col bg-[#050505] shrink-0">
        <ConversationSidebar />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        <ConversationThread />
      </div>

      {/* Customer Panel */}
      <div className="w-[350px] border-l border-[#222] bg-[#050505] shrink-0">
        <Customer360Panel />
      </div>
    </div>
  );
}
