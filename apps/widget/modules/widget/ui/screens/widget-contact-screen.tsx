import { Button } from '@workspace/ui/components/button';
import { WidgetHeader } from '../components/widget-header';
import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { screenAtom } from '../../atoms/widget-atoms';

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);

  // TODO: Replace with actual phone number from widget settings
  const phoneNumber = '(530)799 5605';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setScreen('selection');
  };

  return (
    <>
      <WidgetHeader>
        <div className='flex items-center gap-x-2'>
          <Button variant='transparent' size='icon' onClick={handleBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Contact Us</p>
        </div>
      </WidgetHeader>
      <div className='flex h-full flex-col items-center justify-center gap-y-4'>
        <div className='flex items-center justify-center rounded-full border bg-white p-3'>
          <PhoneIcon className='size-6 text-muted-foreground' />
        </div>
        <p className='text-muted-foreground'>Available 24/7</p>
        <p className='font-bold text-2xl'>(530)799 5605</p>
      </div>
      <div className='border-t bg-background p-4'>
        <div className='flex flex-col items-center gap-y-2'>
          <Button
            className='w-full'
            onClick={handleCopy}
            size='lg'
            variant='outline'
          >
            {copied ? (
              <>
                <CheckIcon className='size-4 mr-2' />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className='size-4 mr-2' />
                Copy Phone Number
              </>
            )}
          </Button>
          <Button asChild className='w-full' size='lg'>
            <Link href={`tel:${phoneNumber}`}>
              <PhoneIcon />
              Call Now
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
