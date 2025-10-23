import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';
import { api } from '@workspace/backend/_generated/api';
import { useMutation } from 'convex/react';
import { widgetSettingsSchema } from '../../schemas';
import { FormSchema, WidgetSettings } from '../../types';

interface CustomizationFormProps {
  initialData: WidgetSettings | null;
}

export const CustomizationForm = ({ initialData }: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || 'Hi! How can I help you today?',
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || '',
        suggestion2: initialData?.defaultSuggestions.suggestion2 || '',
        suggestion3: initialData?.defaultSuggestions.suggestion3 || '',
      },
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
      });

      toast.success('Widget settings saved successfully.');
    } catch (error) {
      console.error('Error saving widget settings:', error);
      toast.error('Failed to save widget settings. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behaviors and messages.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField
              control={form.control}
              name='greetMessage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Welcome message shown when chat open'
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customers will see when they open the chat
                    widget.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className='space-y-4'>
              <div>
                <h3 className='mb-4 text-sm'>Default Suggestions</h3>
                <p className='mb-4 text-muted-foreground text-sm'>
                  Quick reply suggestions shown to customers to help guide the
                  conversation.
                </p>

                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='defaultSuggestions.suggestion1'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='e.g., How do I get started'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='defaultSuggestions.suggestion2'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='e.g., What are your pricing plans?'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='defaultSuggestions.suggestion3'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='e.g., I need help with my account'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
