export const agents = {
  enabled: [
    "formatter",
    "orthography",
    "seo",
    "fiscal",
    "auditor",
    "health",
    "recovery",
    "chronicler",
    "council",
  ],
  llm: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514",
  },
  healthCheck: {
    intervalMinutes: 60,
  },
  council: {
    requiredVotes: 2,
    threshold: 0.7,
  },
  orthography: {
    maxErrorsBeforeFlag: 10,
    fiscalDictionarySize: 200,
  },
} as const;

export type AgentsConfig = typeof agents;
