# Instagit

**Let Your Agent Instantly Understand the World's Code**

An MCP server that gives coding agents instant insight into any Git repository — no guessing, no hallucination.

Instagit lets coding agents understand any GitHub repository by surfacing real function signatures, parameter types, return values, and source citations with exact file paths and line numbers. It eliminates hallucinated APIs by grounding agents in the actual codebase rather than outdated docs or stale training data. Works with Claude Code, Claude Desktop, Cursor, VS Code, and any MCP-compatible client.

## Installation

```bash
npx skills add InstalabsAI/instagit --skill instagit
```

## Quick Start

Add to your MCP client configuration:

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

The `@latest` tag ensures you always get the most recent version. No API key required — the server automatically registers an anonymous token on first use.

For higher rate limits and faster analysis, sign up at [instagit.com](https://instagit.com) and add your API key:

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

Requires Node.js 18+.

## Tool: `ask_repo`

Analyze any Git repository with AI.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `repo` | string | yes | Repository URL, shorthand (`owner/repo`), or any public Git URL |
| `prompt` | string | yes | What to analyze or ask about the codebase |
| `ref` | string | no | Branch, commit SHA, or tag (default: repository's default branch) |
| `fast` | boolean | no | Use fast mode for quicker responses (default: true) |

## Prompting Examples

### Understanding Architecture

```
repo: "vercel/next.js"
prompt: "Explain the architecture and main components. How does the build pipeline work from source to output?"
```

```
repo: "facebook/react"
prompt: "How does the fiber reconciliation algorithm work? Walk me through the key data structures and the reconciliation loop."
```

### Integration and API Usage

```
repo: "stripe/stripe-node"
prompt: "How do I create a subscription with a trial period? Show me the exact method signatures, required parameters, and error types I need to handle."
```

```
repo: "aws/aws-sdk-js-v3"
prompt: "How do I configure the S3 client with custom retry logic and a regional endpoint? What are the actual constructor parameters?"
```

### Debugging and Troubleshooting

```
repo: "prisma/prisma"
prompt: "How does Prisma handle connection pooling? What happens when the pool is exhausted — what error is thrown and where?"
```

```
repo: "expressjs/express"
prompt: "How does Express route matching work internally? When two routes could match the same path, what determines which handler runs?"
```

### Migration Planning

```
repo: "mui/material-ui"
prompt: "What changed in the Button component API between v4 and v5? List every breaking change with the old and new signatures."
ref: "v5.0.0"
```

```
repo: "remix-run/react-router"
prompt: "Compare the route configuration API between v5 and v6. What patterns were removed, renamed, or replaced?"
ref: "main"
```

### Security Review

```
repo: "nextcloud/server"
prompt: "Review the authentication and session management implementation. How are tokens generated, validated, and expired? Are there any obvious security concerns?"
```

### Code Quality and Evaluation

```
repo: "fastify/fastify"
prompt: "How does Fastify's plugin system work? How does it compare architecturally to Express middleware? What are the tradeoffs?"
```

```
repo: "drizzle-team/drizzle-orm"
prompt: "How does Drizzle handle SQL injection prevention? Trace a query from the TypeScript API to the final SQL string."
```

### Private and Internal Repos

```
repo: "my-org/internal-api"
prompt: "What endpoints are available and what are their request/response schemas? List every route handler with its HTTP method and path."
```

## Why Instagit

Agents that integrate with external libraries are flying blind. They read docs (if they exist), guess at APIs, and hallucinate patterns that don't match the actual code. The result: broken integrations, wrong function signatures, outdated usage patterns, hours of debugging. Instagit closes the gap by giving agents direct access to the real codebase.

### Ground Truth, Not Guesses

Go beyond docs and training data. Instagit surfaces the real function signatures, real parameter types, and real return values from the actual codebase.

### Correct on the First Try

When your agent sees the real API surface, it writes integration code that works at runtime. No more plausible-looking code that fails the moment you test it.

### Any Repo, Any Scale

The Linux kernel. React. Kubernetes. Instagit indexes source code at any scale and returns answers with exact file paths and line numbers.

## What Agents Can Do With This

- **Integrate with any library correctly the first time** — Your agent sees the real constructors, the real config options, the real error types.
- **Migrate between versions without the guesswork** — Diff the actual implementations and generate a migration plan that accounts for every breaking change.
- **Debug issues across repository boundaries** — Read both codebases and trace the issue to its root cause, even into libraries you've never opened.
- **Generate integration code that actually works** — Based on the real API surface: actual method names, actual parameter types, actual return values.
- **Evaluate libraries before committing** — Analyze both implementations, compare their approaches to error handling, test coverage, and architectural quality.
- **Onboard to unfamiliar codebases in minutes** — Answers from the code itself, with file paths and line numbers, not from memory that may be months out of date.

## Features

- **Agent-native context** — Purpose-built for coding agents. Returns the exact context an AI needs to understand, modify, and reason about code.
- **Architectural truth** — Goes beyond keyword search. Understands how components connect, why decisions were made, and where the real complexity lives.
- **Any repo, any scale** — From weekend projects to massive monorepos. Public and private repositories, any Git host.
- **Exact source citations** — Every claim traced back to specific files and line numbers. No hallucination, no hand-waving.

## Deep Index

Instagit covers the most complex open-source projects:

- Systems: Linux, Darwin, Windows Kernel
- Engines: V8, Gecko, Godot, Unreal
- Orchestration: Kubernetes, Docker, Terraform
- AI / ML: PyTorch, TensorFlow, Llama.cpp

## Configuration

| Variable | Description | Default |
|---|---|---|
| `INSTAGIT_API_KEY` | API key from [instagit.com](https://instagit.com) | Auto-registers anonymous token |
| `INSTAGIT_API_URL` | Custom API endpoint | Production API |

Anonymous tokens are stored in `~/.instagit/token.json` and shared with the Python MCP server.

## Pricing

- **FREE:** $0 forever, 2M tokens/mo, standard speed, public repos (up to 200 MB)
- **PRO:** $20/mo, 20M tokens/mo, fast mode, all public repos, unlimited repo size, private repos (coming soon), zero data training
- **MAX:** $200/mo, 40M tokens/mo, fast mode, most intelligent (reasoning) model, all public repos, unlimited repo size, all features
- **Enterprise:** Custom token limits, dedicated support, SSO, SLA guarantees, private deployment options

## Docs

- [Homepage](https://instagit.com/index.md): Product overview, features, and installation instructions
- [Installation Guide](https://instagit.com/install.md): Full MCP server setup, configuration, and tool reference
- [Privacy Policy](https://instagit.com/privacy.md): How we collect, use, and protect your information
- [Terms of Service](https://instagit.com/terms.md): Terms governing use of the Instagit service

## License

MIT — Copyright (c) 2026 Instalabs, LLC

---

Learn more at [instagit.com](https://instagit.com)
