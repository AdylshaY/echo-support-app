'use client';

import { useAtomValue } from 'jotai';

import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';
import { screenAtom } from '@/modules/widget/atoms/widget-atoms';
import { WidgetErrorScreen } from '@/modules/widget/ui/screens/widget-error-screen';
import { WidgetLoadingScreen } from '../screens/widget-loading-screen';

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <p>TODO: Selection</p>,
    chat: <p>TODO: Chat</p>,
    contact: <p>TODO: Contact</p>,
  };

  return (
    // TODO: confirm whether or not min-h-screen and min-w-screen is needed
    <main className='flex min-h-screen min-w-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted'>
      {screenComponents[screen]}
    </main>
  );
};
