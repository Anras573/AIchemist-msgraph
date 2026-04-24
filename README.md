# AIchemist-msgraph

An [MCP](https://modelcontextprotocol.io/) server that exposes Microsoft Graph tools for use with AI assistants like Claude Desktop.

## Usage

Add the server to your MCP client config:

```json
{
  "mcpServers": {
    "aichemist-msgraph": {
      "command": "npx",
      "args": ["-y", "@anbora/aichemist-msgraph"],
      "env": {
        "MSGRAPH_TENANT_ID": "your-tenant-id",
        "MSGRAPH_APP_ID": "your-app-id",
        "MSGRAPH_REDIRECT_URI": "http://localhost:3000/"
      }
    }
  }
}
```

On first use, a browser window will open prompting you to sign in with your Microsoft 365 account.

## Azure App Registration

Before using this server, you need to register an application in Azure:

1. Go to [portal.azure.com](https://portal.azure.com) → **Azure Active Directory** → **App registrations**
2. Create a new registration
3. Under **Authentication**, add a redirect URI: `http://localhost:3000/` (type: **Mobile and desktop applications**)
4. Under **API permissions**, add the delegated permission: `Calendars.Read`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MSGRAPH_TENANT_ID` | Yes | Your Azure AD tenant ID |
| `MSGRAPH_APP_ID` | Yes | Your Azure app (client) ID |
| `MSGRAPH_REDIRECT_URI` | Yes | Redirect URI registered in Azure (e.g. `http://localhost:3000/`) |
| `MSGRAPH_SCOPE` | No | OAuth scope — defaults to `Calendars.Read` |

## Available Tools

### `get-calendar-events`

Fetches calendar events for the signed-in Microsoft 365 user within a time range.

| Parameter | Type | Description |
|---|---|---|
| `startDateTime` | `string` (ISO 8601) | Start of the time range. Defaults to now. |
| `endDateTime` | `string` (ISO 8601) | End of the time range. Defaults to 7 days from now. |
