import z from 'zod';
import { widgetSettingsSchema } from './schemas';
import { Doc } from '@workspace/backend/_generated/dataModel';

export type FormSchema = z.infer<typeof widgetSettingsSchema>;
export type WidgetSettings = Doc<'widgetSettings'>;
