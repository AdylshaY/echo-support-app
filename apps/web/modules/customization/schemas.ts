import z from 'zod';

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, 'Greet message is required'),
  defaultSuggestions: z.object({
    suggestion1: z.string(),
    suggestion2: z.string(),
    suggestion3: z.string(),
  }),
});
