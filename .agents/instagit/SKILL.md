---
name: instagit
description: "MCP server that gives coding agents instant insight into any Git repository. Use when an agent needs to understand, analyze, or query any GitHub repository — surfacing real function signatures, parameter types, return values, and source citations with exact file paths and line numbers. Eliminates hallucinated APIs by grounding agents in the actual codebase. Triggers when: (1) setting up Instagit MCP server, (2) querying or analyzing a remote Git repository, (3) understanding library APIs or architecture from source, (4) debugging across repository boundaries, (5) evaluating or comparing libraries, (6) planning migrations between versions."
---

# Instagit

Give coding agents instant insight into any Git repository — no guessing, no hallucination.

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
| `fast`    | boolean  | no       | Use fast mode for quicker responses (default: true)            |

## Prompting Examples

For detailed examples across architecture, integration, debugging, migration, security, and code quality — see [references/examples.md](references/examples.md).

Key patterns:

```
repo: "stripe/stripe-node"
prompt: "How do I create a subscription with a trial period? Show me the exact method signatures, required parameters, and error types."
```

```
repo: "vercel/next.js"
prompt: "Explain the architecture and main components. How does the build pipeline work from source to output?"
```

```
repo: "mui/material-ui"
prompt: "What changed in the Button component API between v4 and v5? List every breaking change with the old and new signatures."
ref: "v5.0.0"
```

## Configuration

| Variable            | Description                                          | Default                      |
|---------------------|------------------------------------------------------|------------------------------|
| `INSTAGIT_API_KEY`  | API key from [instagit.com](https://instagit.com)    | Auto-registers anonymous token |
| `INSTAGIT_API_URL`  | Custom API endpoint                                  | Production API               |

Anonymous tokens stored in `~/.instagit/token.json`.

## Pricing

- **FREE:** $0 forever — 2M tokens/mo, standard speed, public repos (up to 200 MB)
- **PRO:** $20/mo — 20M tokens/mo, fast mode, all public repos, unlimited repo size
- **MAX:** $200/mo — 40M tokens/mo, fast mode, reasoning model, all features
- **Enterprise:** Custom limits, dedicated support, SSO, SLA, private deployment
