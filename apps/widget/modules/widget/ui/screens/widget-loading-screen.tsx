'use client';

import { LoaderIcon } from 'lucide-react';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from '@/modules/widget/atoms/widget-atoms';
import { useAction, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

type InitStep = 'org' | 'session' | 'settings' | 'done';

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>('org');
  const [isSessionValid, setIsSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || '')
  );

  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== 'org') {
      return;
    }

    setLoadingMessage('Loading organization...');

    if (!organizationId) {
      setErrorMessage('Organization ID is required');
      setScreen('error');
      return;
    }

    setLoadingMessage('Finding organization...');

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep('session');
        } else {
          setErrorMessage(result.reason || 'Invalid configuration.');
          setScreen('error');
        }
      })
      .catch((error) => {
        setErrorMessage('Unable to verify organization.');
        setScreen('error');
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    setLoadingMessage,
    validateOrganization,
  ]);

  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== 'session') return;
    setLoadingMessage('Finding contact session...');

    if (!contactSessionId) {
      setIsSessionValid(false);
      setStep('done');
      return;
    }
    setLoadingMessage('Verifying contact session...');

    validateContactSession({ contactSessionId })
      .then((result) => {
        setIsSessionValid(result.valid);
        setStep('done');
      })
      .catch(() => {
        setIsSessionValid(false);
        setStep('done');
      });

    validateContactSession({ contactSessionId });
  }, [
    step,
    contactSessionId,
    setIsSessionValid,
    setStep,
    setLoadingMessage,
    validateContactSession,
  ]);

  useEffect(() => {
    if (step !== 'done') return;

    const hasValidSession = contactSessionId && isSessionValid;

    setScreen(hasValidSession ? 'selection' : 'auth');
  }, [step, contactSessionId, isSessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>Let's get you started</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col justify-center items-center gap-y-4 p-4 text-muted-foreground'>
        <LoaderIcon className='animate-spin' />
        <p className='text-sm'>{loadingMessage || 'Loading...'}</p>
      </div>
    </>
  );
};
