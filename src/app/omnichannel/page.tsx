import { ConversationSidebar } from '@/components/omnichannel/ConversationSidebar';
import { ConversationThread } from '@/components/omnichannel/ConversationThread';
import { Customer360Panel } from '@/components/omnichannel/Customer360Panel';

export const metadata = {
  title: 'Omnichannel | ElderCare CRM',
};

export default function OmnichannelPage() {
  return (
    <div className="flex h-full w-full bg-[#000] text-white">
      <ConversationSidebar />
      <ConversationThread />
      <Customer360Panel />
    </div>
  );
}
