# Analyze Git Repo

**Analyze Any Git Repository in Depth**

Understand architecture, surface real APIs, debug across repo boundaries, plan migrations, and evaluate libraries — all grounded in the actual source code with exact file paths and line numbers. No guessing, no hallucination.

Works with Claude Code, Claude Desktop, Cursor, VS Code, and any MCP-compatible client. Powered by [Instagit](https://instagit.com).

## Installation

```bash
npx skills add InstalabsAI/instagit --skill analyze-git-repo
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

## Prompting Examples

### Understanding Architecture

```
repo: "nginx/nginx"
prompt: "How does nginx handle thousands of concurrent connections with its event-driven architecture? Walk through the event loop, worker process model, and connection state transitions."
```

```
repo: "meilisearch/meilisearch"
prompt: "How does Meilisearch rank results so fast? Walk through the ranking rule pipeline — typo tolerance, proximity, attribute ranking — and where the HNSW index fits in."
```

### Integration and API Usage

```
repo: "hashicorp/terraform"
prompt: "How do I implement a custom Terraform provider from scratch? What interfaces does the SDK expose, how are CRUD operations mapped to the resource lifecycle, and how does schema definition work?"
```

```
repo: "huggingface/transformers"
prompt: "How does HuggingFace Transformers' pipeline() auto-detect the right model, tokenizer, and default checkpoint when called with just a task name like 'sentiment-analysis'?"
```

### Debugging and Troubleshooting

```
repo: "docker/compose"
prompt: "How does Docker Compose resolve service dependencies and determine startup order? What happens when a service declares depends_on with a health check condition?"
```

```
repo: "openai/whisper"
prompt: "How does Whisper detect the spoken language in multilingual audio? Walk through the language detection tokens and how the model selects the correct language before transcription begins."
```

### Security Review

```
repo: "redis/redis"
prompt: "Review Redis's ACL security model. How are per-user command permissions enforced on each request, and how does AUTH prevent privilege escalation?"
```

```
repo: "auth0/node-jsonwebtoken"
prompt: "How does jsonwebtoken's verify() prevent algorithm confusion attacks? Walk through how it validates the alg header, enforces the allowlist, and prevents key/algorithm mismatches."
```

### Code Quality and Evaluation

```
repo: "vitejs/vite"
prompt: "How does Vite's plugin system compare architecturally to Rollup's? What are the Vite-specific hooks, and what tradeoffs does the design introduce?"
```

```
repo: "evanw/esbuild"
prompt: "How does esbuild achieve such fast build speeds? What parallelism strategy does the bundler use across parsing, linking, and code generation?"
```

### Deep Technical Analysis

```
repo: "ggml-org/llama.cpp"
prompt: "How does llama.cpp's KV cache work during autoregressive generation? How are past key-value pairs stored, reused across tokens, and evicted when the context window fills up?"
```

```
repo: "tinygrad/tinygrad"
prompt: "How does tinygrad's lazy evaluation system work? When I write tensor operations, how does it build the computation graph and when does it actually execute on hardware?"
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

- **FREE:** $0 forever, 2M tokens/mo, standard speed, public repos (up to 2 GB)
- **PRO:** $20/mo, 20M tokens/mo, fast mode, all public repos, unlimited repo size, private repos (coming soon), zero data training
- **MAX:** $200/mo, 40M tokens/mo, fast mode, most intelligent (reasoning) model, all public repos, unlimited repo size, all features
- **Enterprise:** Custom token limits, dedicated support, SSO, SLA guarantees, private deployment options

## Docs

- [Homepage](https://instagit.com/index.md): Product overview, features, and installation instructions
- [Installation Guide](https://instagit.com/install.md): Full MCP server setup, configuration, and tool reference
- [Privacy Policy](https://instagit.com/privacy.md): How we collect, use, and protect your information
- [Terms of Service](https://instagit.com/terms.md): Terms governing use of the Instagit service

---

Learn more at [instagit.com](https://instagit.com)
