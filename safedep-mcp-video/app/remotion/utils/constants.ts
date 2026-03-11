export const SCENE_1_FRAMES = 270;
export const SCENE_2_FRAMES = 270;
export const SCENE_3_FRAMES = 330;
export const SCENE_4_FRAMES = 210;
export const TRANSITION_FRAMES = 30;

export const SAFEDEP_ENDPOINT =
  "https://mcp.safedep.io/model-context-protocol/threats/v1/mcp";

export const SAFEDEP_HEADERS = [
  'Authorization: <API Key>',
  'X-Tenant-ID: <Tenant Domain>',
];

export const SUPPORTED_TOOLS = [
  "Claude Code",
  "Cursor",
  "OpenAI Codex",
  "Gemini CLI",
  "Windsurf",
  "Zed",
];

export const CODEX_CONFIG_SNIPPET = [
  "[mcp_servers.safedep]",
  `url = "${SAFEDEP_ENDPOINT}"`,
  "",
  "[mcp_servers.safedep.env_http_headers]",
  '"Authorization" = "SAFEDEP_API_KEY"',
  '"X-Tenant-ID" = "SAFEDEP_TENANT_ID"',
];

export const TEST_PACKAGE = "safedep-test-pkg";
