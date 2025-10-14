'use client';

import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { Button } from '@workspace/ui/components/button';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeftIcon, MenuIcon } from 'lucide-react';
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from '../../atoms/widget-atoms';
import { useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

export const WidgetChatScreen = () => {
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || '')
  );

  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const onBack = () => {
    setConversationId(null);
    setScreen('selection');
  };

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : 'skip'
  );

  return (
    <>
      <WidgetHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='transparent' onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button variant='transparent' size='icon'>
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <div className='flex flex-1 f`lex-col gap-y-4 p-4'>
        {JSON.stringify(conversation, null, 2)}
      </div>
    </>
  );
};
