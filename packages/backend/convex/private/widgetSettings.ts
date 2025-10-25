import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { internal } from '../_generated/api';

export const upsert = mutation({
  args: {
    greetMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.string(),
      suggestion2: v.string(),
      suggestion3: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Identity not found',
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Organization not found',
      });
    }

    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      {
        organizationId: orgId,
      }
    );

    if (subscription?.status !== 'active')
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Subscription is not active',
      });

    const existingWidgetSettings = await ctx.db
      .query('widgetSettings')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', orgId))
      .unique();

    if (existingWidgetSettings) {
      await ctx.db.patch(existingWidgetSettings._id, {
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggestions,
      });
    } else {
      await ctx.db.insert('widgetSettings', {
        organizationId: orgId,
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggestions,
      });
    }
  },
});

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Identity not found',
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Organization not found',
      });
    }

    const widgetSettings = await ctx.db
      .query('widgetSettings')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', orgId))
      .unique();

    return widgetSettings;
  },
});
