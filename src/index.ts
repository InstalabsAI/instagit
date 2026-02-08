/**
 * Instagit MCP Server — TypeScript entry point.
 * Provides the `ask_repo` tool for AI-powered Git repository analysis.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { analyzeRepoStreaming, getApiUrl } from "./api.js";
import { createProgressTracker, formatMessage } from "./kitt.js";
import { getOrCreateToken, registerAnonymousToken, clearStoredToken } from "./token.js";
import type { ProgressTracker } from "./types.js";

const server = new McpServer({
  name: "instagit",
  version: "0.1.5",
});

const TOOL_DESCRIPTION = `Analyze any Git repository with AI. Point it at a repo and ask questions about the codebase.

Example prompts by use case:

Understanding Architecture:
- repo: "nginx/nginx", prompt: "How does nginx handle concurrent connections? Walk through the event loop, worker process model, and connection state transitions."

Integration and API Usage:
- repo: "hashicorp/terraform", prompt: "How do I implement a custom provider? What interfaces does the SDK expose, how are CRUD operations mapped to the resource lifecycle?"

Debugging and Troubleshooting:
- repo: "docker/compose", prompt: "How does Compose resolve service dependencies and startup order? What happens with depends_on and health check conditions?"

Security Review:
- repo: "redis/redis", prompt: "Review the ACL security model. How are per-user command permissions enforced, and how does AUTH prevent privilege escalation?"

Code Quality and Evaluation:
- repo: "vitejs/vite", prompt: "How does Vite's plugin system compare to Rollup's? What are the Vite-specific hooks and tradeoffs?"

Deep Technical Analysis:
- repo: "ggml-org/llama.cpp", prompt: "How does the KV cache work during autoregressive generation? How are past key-value pairs stored, reused, and evicted?"

Migration Planning (with ref — Pro/Max plans only):
- repo: "mui/material-ui", ref: "v4.12.0", prompt: "Document the Button component's full API surface — every prop, its type, default value, and behavior."
- repo: "mui/material-ui", ref: "v5.0.0", prompt: "Document the Button component's full API surface — every prop, its type, default value, and behavior."
  (Compare both results to build a migration guide between v4 and v5)
- repo: "kubernetes/kubernetes", ref: "release-1.29", prompt: "How does the scheduler's scoring and filtering pipeline work for pod placement?"

Ask detailed, specific questions — the tool returns real function signatures, parameter types, return values, and source citations with exact file paths and line numbers.

If you hit a rate limit (429), the user's monthly token credits are exhausted — they can wait for the reset or upgrade their plan. Free-tier repos larger than 2 GB will be rejected with a 413 error; suggest upgrading to Pro or Max for unlimited repo size.`;

server.tool(
  "ask_repo",
  TOOL_DESCRIPTION,
  {
    repo: z
      .string()
      .describe(
        "Repository to analyze. Accepts GitHub URLs (https://github.com/owner/repo), " +
          "shorthand (owner/repo), GitLab/Bitbucket URLs, or any public Git URL"
      ),
    prompt: z.string().describe("What to analyze or ask about the codebase"),
    ref: z
      .string()
      .nullable()
      .optional()
      .default(null)
      .describe("Branch, commit SHA, or tag to analyze (default: repository's default branch)"),
  },
  async ({ repo, prompt, ref }, extra) => {
    const apiUrl = getApiUrl();
    const tracker: ProgressTracker = createProgressTracker();

    // Use client-provided progress token, or generate one so progress works regardless
    const progressToken = extra._meta?.progressToken ?? `ask_repo_${Date.now()}`;

    // Progress callback using MCP notifications
    const sendProgress = async (message: string) => {
      try {
        await extra.sendNotification({
          method: "notifications/progress" as const,
          params: {
            progressToken,
            progress: tracker.outputTokens,
            message,
          },
        });
      } catch {
        // Ignore notification errors — client may not support progress
      }
    };

    // Get or register token
    let token = getOrCreateToken();

    if (!token) {
      await sendProgress(formatMessage(tracker, "Registering anonymous token..."));
      token = await registerAnonymousToken(apiUrl);
      if (!token) {
        return {
          content: [
            {
              type: "text" as const,
              text:
                "Unable to register anonymous token. " +
                "This may be because you've reached the limit of 3 tokens per IP address.\n\n" +
                "To continue using Instagit:\n" +
                "1. Sign up for a free account at https://instagit.ai/signup\n" +
                "2. Get an API key from your dashboard\n" +
                "3. Set INSTAGIT_API_KEY in your MCP configuration",
            },
          ],
        };
      }
    }

    await sendProgress(formatMessage(tracker, "Connecting..."));

    // Attempt the API call
    const callApi = async (authToken: string) => {
      return analyzeRepoStreaming({
        repo,
        prompt,
        ref,
        token: authToken,
        progressCallback: sendProgress,
        tracker,
      });
    };

    let result;
    try {
      result = await callApi(token);
    } catch (err: unknown) {
      const error = err as Error & { status?: number; body?: string };

      // Handle connection errors
      if (error.message?.includes("fetch failed") || error.message?.includes("ECONNREFUSED")) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Could not connect to Instagit API at ${apiUrl}. Make sure the API server is running.`,
            },
          ],
        };
      }

      // Handle rate limiting (429)
      if (error.status === 429) {
        let rateLimitUntil: string | undefined;
        try {
          const errorData = JSON.parse(error.body ?? "{}");
          rateLimitUntil = errorData.rate_limit_until;
        } catch {
          // ignore
        }

        const resetInfo = rateLimitUntil ? `\nCredits will reset at: ${rateLimitUntil}\n` : "";
        return {
          content: [
            {
              type: "text" as const,
              text:
                `Rate limit exceeded. Your free credits have been exhausted.\n${resetInfo}\n` +
                "To continue using Instagit immediately:\n" +
                "- Upgrade to Pro ($20/mo) for 10x more credits and faster analysis\n" +
                "- Visit: https://instagit.ai/pricing",
            },
          ],
        };
      }

      // Handle auth errors (401) — retry with fresh token
      if (error.status === 401) {
        clearStoredToken();
        const newToken = await registerAnonymousToken(apiUrl);
        if (newToken) {
          try {
            result = await callApi(newToken);
          } catch (retryErr: unknown) {
            const retryError = retryErr as Error & { status?: number };
            return {
              content: [
                {
                  type: "text" as const,
                  text: `API error after re-auth: ${retryError.status ?? retryError.message}`,
                },
              ],
            };
          }
        } else {
          return {
            content: [
              {
                type: "text" as const,
                text:
                  "Authentication failed. Unable to register a new token.\n\n" +
                  "Please set INSTAGIT_API_KEY in your MCP configuration, " +
                  "or visit https://instagit.ai/signup to create an account.",
              },
            ],
          };
        }
      }

      // Other errors
      if (!result) {
        return {
          content: [
            {
              type: "text" as const,
              text: `API error: ${error.status ?? ""} ${error.message}`,
            },
          ],
        };
      }
    }

    // Format response with usage footer
    let responseText = result!.text;

    const footerParts: string[] = [];
    if (result!.totalTokens > 0) {
      footerParts.push(
        `Tokens: ${result!.inputTokens.toLocaleString()} input, ` +
          `${result!.outputTokens.toLocaleString()} output, ` +
          `${result!.totalTokens.toLocaleString()} total`
      );
    }
    if (result!.tier) {
      footerParts.push(`Tier: ${result!.tier}`);
    }
    if (result!.tokensRemaining > 0) {
      footerParts.push(`Credits remaining: ${result!.tokensRemaining.toLocaleString()}`);
    }
    if (footerParts.length > 0) {
      responseText += "\n\n---\n" + footerParts.join(" | ");
    }
    if (result!.upgradeHint) {
      responseText += `\n\n${result!.upgradeHint}`;
    }

    return {
      content: [{ type: "text" as const, text: responseText }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
