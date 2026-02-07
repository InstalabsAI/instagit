# Prompting Examples

## Understanding Architecture

```
repo: "vercel/next.js"
prompt: "Explain the architecture and main components. How does the build pipeline work from source to output?"
```

```
repo: "facebook/react"
prompt: "How does the fiber reconciliation algorithm work? Walk me through the key data structures and the reconciliation loop."
```

## Integration and API Usage

```
repo: "stripe/stripe-node"
prompt: "How do I create a subscription with a trial period? Show me the exact method signatures, required parameters, and error types I need to handle."
```

```
repo: "aws/aws-sdk-js-v3"
prompt: "How do I configure the S3 client with custom retry logic and a regional endpoint? What are the actual constructor parameters?"
```

## Debugging and Troubleshooting

```
repo: "prisma/prisma"
prompt: "How does Prisma handle connection pooling? What happens when the pool is exhausted — what error is thrown and where?"
```

```
repo: "expressjs/express"
prompt: "How does Express route matching work internally? When two routes could match the same path, what determines which handler runs?"
```

## Migration Planning

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

## Security Review

```
repo: "nextcloud/server"
prompt: "Review the authentication and session management implementation. How are tokens generated, validated, and expired? Are there any obvious security concerns?"
```

## Code Quality and Evaluation

```
repo: "fastify/fastify"
prompt: "How does Fastify's plugin system work? How does it compare architecturally to Express middleware? What are the tradeoffs?"
```

```
repo: "drizzle-team/drizzle-orm"
prompt: "How does Drizzle handle SQL injection prevention? Trace a query from the TypeScript API to the final SQL string."
```

## Private and Internal Repos

```
repo: "my-org/internal-api"
prompt: "What endpoints are available and what are their request/response schemas? List every route handler with its HTTP method and path."
```
