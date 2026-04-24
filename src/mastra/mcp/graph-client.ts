import { InteractiveBrowserCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[aichemist-msgraph] Missing required environment variable: ${key}\n` +
      `Set it in your MCP client config under "env": { "${key}": "..." }`
    );
  }
  return value;
}

// Validated at module load — server fails fast if credentials are missing
const tenantId = requireEnv('MSGRAPH_TENANT_ID');
const clientId = requireEnv('MSGRAPH_APP_ID');
const redirectUri = requireEnv('MSGRAPH_REDIRECT_URI'); // Must match the redirect URI registered in Azure AD
const scope = process.env.MSGRAPH_SCOPE ?? 'Calendars.Read';

// Browser login is triggered lazily on the first API call
const credential = new InteractiveBrowserCredential({ tenantId, clientId, redirectUri });

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: [scope],
});

export const graphClient = Client.initWithMiddleware({ authProvider });
