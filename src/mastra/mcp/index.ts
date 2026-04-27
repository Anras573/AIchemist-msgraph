import { MCPServer } from '@mastra/mcp';
import { calendarTool } from '../tools/calendar-tool';
import { calendarEventDetailTool } from '../tools/calendar-event-detail-tool';

export const mcpServer = new MCPServer({
  id: 'aichemist-msgraph',
  name: 'AIchemist MS Graph MCP Server',
  version: '0.0.0',
  tools: {
    calendarTool,
    calendarEventDetailTool,
  },
});
