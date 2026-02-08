/**
 * SSE streaming client for the /v1/responses endpoint.
 * Uses native fetch() + eventsource-parser for lightweight SSE parsing.
 */

import { createParser, type EventSourceMessage } from "eventsource-parser";
import { createProgressTracker, formatMessage } from "./kitt.js";
import type { AnalysisResult, ProgressTracker, SSEEventData } from "./types.js";

const DEFAULT_API_URL = "https://instagit--instagit-api-api.modal.run";

export function getApiUrl(): string {
  return process.env.INSTAGIT_API_URL || DEFAULT_API_URL;
}

/**
 * Build the model string for the API request.
 * The API encodes repo info in the model field:
 * - owner/repo or full URL
 * - @ref suffix for branch/tag/commit
 */
function buildModelString(repo: string, ref: string | null): string {
  let model = repo;
  if (ref) model += `@${ref}`;
  return model;
}

export interface StreamOptions {
  repo: string;
  prompt: string;
  ref?: string | null;
  token?: string | null;
  progressCallback?: (message: string) => Promise<void>;
  tracker?: ProgressTracker;
}

export async function analyzeRepoStreaming(opts: StreamOptions): Promise<AnalysisResult> {
  const {
    repo,
    prompt,
    ref = null,
    token = null,
    progressCallback,
  } = opts;
  const tracker = opts.tracker ?? createProgressTracker();

  const apiUrl = getApiUrl();
  const model = buildModelString(repo, ref);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload = {
    model,
    input: prompt,
    stream: true,
  };

  let collectedText = "";
  let usage: Record<string, unknown> = {};

  // Heartbeat: send progress updates at 250ms intervals
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  if (progressCallback) {
    heartbeatInterval = setInterval(async () => {
      if (!tracker.done) {
        try {
          await progressCallback(formatMessage(tracker));
        } catch {
          // Ignore progress errors
        }
      }
    }, 250);
  }

  try {
    const response = await fetch(`${apiUrl}/v1/responses`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      const error = new Error(`API error: ${response.status}`) as Error & {
        status: number;
        body: string;
      };
      error.status = response.status;
      error.body = errorBody;
      throw error;
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    // Parse SSE stream
    await new Promise<void>((resolve, reject) => {
      const parser = createParser({
        onEvent(event: EventSourceMessage) {
          if (event.data === "[DONE]") {
            resolve();
            return;
          }

          let data: SSEEventData;
          try {
            data = JSON.parse(event.data);
          } catch {
            return;
          }

          const eventType = data.type ?? "";

          if (eventType === "response.reasoning.delta") {
            const status = data.delta ?? "";
            if (status) tracker.lastStatus = status;
            if (data.tokens) {
              if (data.tokens.input !== undefined) tracker.inputTokens = data.tokens.input;
              if (data.tokens.output !== undefined) tracker.outputTokens = data.tokens.output;
            }
          } else if (eventType === "response.output_text.delta") {
            const delta = data.delta ?? "";
            collectedText += delta;
            if (tracker.outputTokens === 0) {
              tracker.outputTokens = Math.floor(collectedText.length / 4);
            }
            tracker.lastStatus = "Writing response...";
          } else if (eventType === "response.completed") {
            usage = (data.response?.usage as Record<string, unknown>) ?? {};
          }
        },
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      function read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              resolve();
              return;
            }
            parser.feed(decoder.decode(value, { stream: true }));
            read();
          })
          .catch(reject);
      }

      read();
    });
  } finally {
    tracker.done = true;
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
  }

  return {
    text: collectedText,
    inputTokens: (usage.input_tokens as number) ?? 0,
    outputTokens: (usage.output_tokens as number) ?? 0,
    totalTokens: (usage.total_tokens as number) ?? 0,
    tier: (usage.tier as string) ?? "free",
    tokensRemaining: (usage.tokens_remaining as number) ?? 0,
    upgradeHint: (usage.upgrade_hint as string) ?? null,
  };
}
