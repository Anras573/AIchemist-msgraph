
import { Mastra } from '@mastra/core/mastra';
import { mcpServer } from './mcp';

export const mastra = new Mastra({
  mcpServers: { mcpServer },
});
