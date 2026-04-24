import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { graphClient } from '../mcp/graph-client';

const calendarEventSchema = z.object({
  id: z.string(),
  subject: z.string(),
  start: z.object({ dateTime: z.string(), timeZone: z.string() }),
  end: z.object({ dateTime: z.string(), timeZone: z.string() }),
  location: z.string().optional(),
  isOnlineMeeting: z.boolean().optional(),
  onlineMeetingUrl: z.string().nullish(),
});

export const calendarTool = createTool({
  id: 'get-calendar-events',
  description: 'Get calendar events for the signed-in Microsoft 365 user within a time range',
  inputSchema: z.object({
    startDateTime: z
      .string()
      .optional()
      .describe('Start of the time range in ISO 8601 format. Defaults to now.'),
    endDateTime: z
      .string()
      .optional()
      .describe('End of the time range in ISO 8601 format. Defaults to 7 days from now.'),
  }),
  outputSchema: z.object({
    events: z.array(calendarEventSchema),
  }),
  execute: async (input) => {
    const start = input.startDateTime ?? new Date().toISOString();
    const end =
      input.endDateTime ??
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await graphClient
      .api('/me/calendarView')
      .query({ startDateTime: start, endDateTime: end })
      .select('id,subject,start,end,location,isOnlineMeeting,onlineMeetingUrl')
      .orderby('start/dateTime')
      .top(50)
      .get();

    return {
      events: response.value.map((event: any) => ({
        id: event.id,
        subject: event.subject ?? '(No subject)',
        start: event.start,
        end: event.end,
        location: event.location?.displayName,
        isOnlineMeeting: event.isOnlineMeeting,
        onlineMeetingUrl: event.onlineMeetingUrl,
      })),
    };
  },
});
