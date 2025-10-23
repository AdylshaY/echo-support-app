import { defineSchema } from 'convex/server';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  widgetSettings: defineTable({
    organizationId: v.string(),
    greetMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.string(),
      suggestion2: v.string(),
      suggestion3: v.string(),
    }),
  }).index('by_organizationId', ['organizationId']),
  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id('contactSessions'),
    status: v.union(
      v.literal('unresolved'),
      v.literal('resolved'),
      v.literal('escalated')
    ),
  })
    .index('by_organization_id', ['organizationId'])
    .index('by_contact_session_id', ['contactSessionId'])
    .index('by_threadId', ['threadId'])
    .index('by_status_and_organizationId', ['status', 'organizationId']),
  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      })
    ),
  })
    .index('by_organizationId', ['organizationId'])
    .index('by_expiresAt', ['expiresAt']),
  users: defineTable({
    name: v.string(),
  }),
});
