import { MCPServer } from '@mastra/mcp';
import { weatherTool } from '../tools/weather-tool';
import { calendarTool } from '../tools/calendar-tool';

export const mcpServer = new MCPServer({
  id: 'aichemist-msgraph',
  name: 'AIchemist MS Graph MCP Server',
  version: '0.0.0',
  tools: {
    weatherTool,
    calendarTool,
  },
});
