---
name: analyze-git-repo
description: "Analyze any Git repository in depth — understand architecture, debug across repo boundaries, review APIs, plan migrations, and evaluate libraries. Surfaces real function signatures, parameter types, return values, and source citations with exact file paths and line numbers. Eliminates hallucinated APIs by grounding agents in the actual codebase. Powered by Instagit. Triggers when: (1) querying or analyzing a remote Git repository, (2) understanding library APIs or architecture from source, (3) debugging across repository boundaries, (4) evaluating or comparing libraries, (5) planning migrations between versions, (6) setting up the Instagit MCP server."
---

# Analyze Git Repo

Analyze any Git repository in depth — understand architecture, surface real APIs, debug across repo boundaries, and get source citations with exact file paths and line numbers. Powered by [Instagit](https://instagit.com).

## Quick Start

Add to MCP client configuration:

```json
{
  "mcpServers": {
    "instagit": {
      "command": "npx",
      "args": ["-y", "instagit@latest"]
    }
  }
}
```

No API key required — auto-registers anonymous token on first use. Requires Node.js 18+.

For higher rate limits, sign up at [instagit.com](https://instagit.com) and add an API key:

```json
{
  "mcpServers": {
    "instagit": {
      "command": "npx",
      "args": ["-y", "instagit@latest"],
      "env": {
        "INSTAGIT_API_KEY": "ig_your_api_key_here"
      }
    }
  }
}
```

Works with Claude Code, Claude Desktop, Cursor, VS Code, and any MCP-compatible client.

## Tool: `ask_repo`

Analyze any Git repository with AI.

| Parameter | Type     | Required | Description                                                    |
|-----------|----------|----------|----------------------------------------------------------------|
| `repo`    | string   | yes      | Repository URL, shorthand (`owner/repo`), or any public Git URL |
| `prompt`  | string   | yes      | What to analyze or ask about the codebase                      |
| `ref`     | string   | no       | Branch, commit SHA, or tag (default: repo's default branch)    |

## Prompting Examples

For detailed examples across architecture, integration, debugging, migration, security, and code quality — see [references/examples.md](references/examples.md).

Key patterns:

```
repo: "nginx/nginx"
prompt: "How does nginx handle thousands of concurrent connections with its event-driven architecture? Walk through the event loop, worker process model, and connection state transitions."
```

```
repo: "hashicorp/terraform"
prompt: "How do I implement a custom Terraform provider from scratch? What interfaces does the SDK expose, how are CRUD operations mapped to the resource lifecycle, and how does schema definition work?"
```

```
repo: "ggml-org/llama.cpp"
prompt: "How does llama.cpp's KV cache work during autoregressive generation? How are past key-value pairs stored, reused across tokens, and evicted when the context window fills up?"
```

## Configuration

| Variable            | Description                                          | Default                      |
|---------------------|------------------------------------------------------|------------------------------|
| `INSTAGIT_API_KEY`  | API key from [instagit.com](https://instagit.com)    | Auto-registers anonymous token |
| `INSTAGIT_API_URL`  | Custom API endpoint                                  | Production API               |

Anonymous tokens stored in `~/.instagit/token.json`.

## Pricing

- **FREE:** $0 forever — 2M tokens/mo, standard speed, public repos (up to 2 GB)
- **PRO:** $20/mo — 20M tokens/mo, fast mode, all public repos, unlimited repo size
- **MAX:** $200/mo — 40M tokens/mo, fast mode, reasoning model, all features
- **Enterprise:** Custom limits, dedicated support, SSO, SLA, private deployment
