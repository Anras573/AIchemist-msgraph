import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { graphClient } from '../mcp/graph-client';

export const calendarEventDetailTool = createTool({
  id: 'get-calendar-event-detail',
  description:
    'Get the full details of a single Microsoft 365 calendar event, including its description/body. Use the event id returned by get-calendar-events.',
  inputSchema: z.object({
    eventId: z
      .string()
      .regex(/^[A-Za-z0-9+/=_\-]{10,}$/, 'Invalid event ID format')
      .describe('The id of the calendar event.'),
  }),
  outputSchema: z.object({
    id: z.string(),
    subject: z.string(),
    start: z.object({ dateTime: z.string(), timeZone: z.string() }),
    end: z.object({ dateTime: z.string(), timeZone: z.string() }),
    location: z.string().optional(),
    isOnlineMeeting: z.boolean().optional(),
    onlineMeetingUrl: z.string().nullish(),
    body: z.object({
      contentType: z.enum(['html', 'text']).catch('text'),
      content: z.string(),
    }),
  }),
  execute: async (input) => {
    const event = await graphClient
      .api(`/me/events/${encodeURIComponent(input.eventId)}`)
      .select('id,subject,start,end,location,isOnlineMeeting,onlineMeetingUrl,body')
      .get();

    return {
      id: event.id,
      subject: event.subject ?? '(No subject)',
      start: event.start,
      end: event.end,
      location: event.location?.displayName,
      isOnlineMeeting: event.isOnlineMeeting,
      onlineMeetingUrl: event.onlineMeetingUrl,
      body: {
        contentType: event.body.contentType,
        content: event.body.content,
      },
    };
  },
});
