# Instagit

**Let Your Agents Instantly Understand the World's Code**

An MCP server that gives coding agents instant insight into any Git repository — no guessing, no hallucination.

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

Works with **Claude Code**, **Claude Desktop**, **Cursor**, and any MCP-compatible client. The `@latest` tag ensures you always get the most recent version.

## Why

Agents that integrate with external libraries are flying blind. They read docs (if they exist), guess at APIs, and hallucinate patterns that don't match the actual code. The result: broken integrations, wrong function signatures, outdated usage patterns, hours of debugging.

When an agent can actually analyze the source code of a library or service it's integrating with, everything changes. It sees the real function signatures, the actual data flow, the patterns the maintainers intended. Integration becomes dramatically easier and less error-prone because the agent is working from ground truth, not guesses.

## What Agents Can Do With This

- **Integrate with any library correctly the first time** — "How do I set up authentication with this SDK?" gets answered from the actual code, not outdated docs or training data. Your agent sees the real constructors, the real config options, the real error types.
- **Migrate between versions without the guesswork** — Point your agent at both the old and new version of a library. It can diff the actual implementations and generate a migration plan that accounts for every breaking change.
- **Debug issues across repository boundaries** — When a bug spans your code and a dependency, your agent can read both codebases and trace the issue to its root cause — even into libraries you've never opened.
- **Generate integration code that actually works** — Instead of producing plausible-looking code that fails at runtime, your agent writes integration code based on the real API surface: actual method names, actual parameter types, actual return values.
- **Evaluate libraries before committing** — "Should we use library A or B?" Your agent can analyze both implementations, compare their approaches to error handling, test coverage, and architectural quality, and give you a grounded recommendation.
- **Onboard to unfamiliar codebases in minutes** — Point your agent at any repo and ask how things work. It answers from the code itself, with file paths and line numbers, not from memory that may be months out of date.

## Features

- **Agent-native context** — Purpose-built for coding agents. Returns the exact context an AI needs to understand, modify, and reason about code.
- **Architectural truth** — Goes beyond keyword search. Understands how components connect, why decisions were made, and where the real complexity lives.
- **Any repo, any scale** — From weekend projects to massive monorepos. Public and private repositories, any Git host.
- **Exact source citations** — Every claim traced back to specific files and line numbers. No hallucination, no hand-waving.

## Configuration

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `INSTAGIT_API_KEY` | API key from [instagit.com](https://instagit.com) | Auto-registers anonymous token |
| `INSTAGIT_API_URL` | Custom API endpoint | Production API |

### Authenticated Usage

Sign up at [instagit.com](https://instagit.com) for higher rate limits and faster analysis:

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

### Anonymous Usage

No API key required — the server automatically registers an anonymous token on first use. Anonymous tokens are stored in `~/.instagit/token.json` and shared with the Python MCP server.

## Tool: `ask_repo`

Analyze any Git repository with AI.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `repo` | string | yes | Repository URL, shorthand (`owner/repo`), or any public Git URL |
| `prompt` | string | yes | What to analyze or ask about the codebase |
| `ref` | string | no | Branch, commit SHA, or tag (default: repository's default branch) |
| `fast` | boolean | no | Use fast mode for quicker responses (default: true) |

**Example prompts:**
- "Explain the architecture and main components"
- "Review the authentication implementation for security issues"
- "How would I add a new API endpoint following existing patterns?"
- "What would it take to upgrade from React 17 to 18?"

## Requirements

- Node.js 18+

## License

MIT — Copyright (c) 2026 Instalabs, LLC

---

Learn more at [instagit.com](https://instagit.com)
