/**
 * Shared types for Instagit MCP server.
 */

export interface AnalysisResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  tier: string;
  tokensRemaining: number;
  upgradeHint: string | null;
}

export interface ProgressTracker {
  startTime: number;
  frameIndex: number;
  inputTokens: number;
  outputTokens: number;
  displayedTokens: number;
  lastStatus: string;
  done: boolean;
}

export interface UsageData {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  tier?: string;
  tokens_remaining?: number;
  upgrade_hint?: string;
}

export interface SSEEventData {
  type?: string;
  delta?: string;
  tokens?: { input?: number; output?: number };
  response?: {
    usage?: UsageData;
  };
}
