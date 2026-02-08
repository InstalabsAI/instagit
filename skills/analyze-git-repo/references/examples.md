# Prompting Examples

### Understanding Architecture

```
repo: "nginx/nginx"
prompt: "How does nginx handle thousands of concurrent connections with its event-driven architecture? Walk through the event loop, worker process model, and connection state transitions."
answer: "The master process forks workers that share listening sockets and each run a single-threaded event loop via ngx_process_events_and_timers. Each iteration acquires the accept mutex, dispatches ready events through epoll/kqueue, and processes posted accept/read/write events without ever blocking. Connections transition between states through ngx_handle_write_event, and keep-alive connections recycle into the reusable queue — all driven by kernel notifications with zero per-connection threads."
sources: [src/event/ngx_event.c:195, src/event/ngx_event_accept.c:20]
```

```
repo: "meilisearch/meilisearch"
prompt: "How does Meilisearch rank results so fast? Walk through the ranking rule pipeline — typo tolerance, proximity, attribute ranking — and where the HNSW index fits in."
answer: "Meilisearch runs a pipeline of graph-based ranking rules — words, typo, proximity, attribute, exactness — each traversing a cost-weighted QueryGraph and emitting document buckets in decreasing relevance. Each rule shrinks the candidate universe for the next, with dead-end caching and early termination keeping it sub-millisecond. For hybrid search, an HNSW index retrieves nearest-neighbor vectors first, then the textual pipeline refines on that small candidate set."
sources: [crates/milli/src/search/new/graph_based_ranking_rule.rs, crates/milli/src/vector/store.rs]
```

### Integration and API Usage

```
repo: "hashicorp/terraform"
prompt: "How do I implement a custom Terraform provider from scratch? What interfaces does the SDK expose, how are CRUD operations mapped to the resource lifecycle, and how does schema definition work?"
answer: "A provider implements the Interface from internal/providers/provider.go, which defines RPCs for the full resource lifecycle. CRUD maps to three methods: ReadResource for reads, PlanResourceChange for diffs, and ApplyResourceChange for create/update/delete — determined by whether prior or planned state is null. Schemas are declared via the Schema struct in helper/schema, defining each attribute's type, required/optional/computed flags, ForceNew behavior, and validation callbacks."
sources: [internal/providers/provider.go, internal/legacy/helper/schema/schema.go]
```

```
repo: "huggingface/transformers"
prompt: "How does HuggingFace Transformers' pipeline() auto-detect the right model, tokenizer, and default checkpoint when called with just a task name like 'sentiment-analysis'?"
answer: "pipeline() normalizes the task string through TASK_ALIASES (e.g. 'sentiment-analysis' → 'text-classification'), then looks up SUPPORTED_TASKS for the pipeline class and default checkpoint. get_default_model_and_revision() returns the model ID and revision hash, AutoConfig and AutoTokenizer fetch the matching artifacts, and the concrete pipeline class is instantiated ready for inference."
sources: [src/transformers/pipelines/__init__.py:440, src/transformers/pipelines/base.py:75]
```

### Debugging and Troubleshooting

```
repo: "docker/compose"
prompt: "How does Docker Compose resolve service dependencies and determine startup order? What happens when a service declares depends_on with a health check condition?"
answer: "Compose builds a directed dependency graph from each service's depends_on map, then walks it leaves-first via InDependencyOrder so dependencies start before dependents. waitDependencies evaluates the declared condition: service_started checks the container is running, service_healthy polls Docker's health-check API, and service_completed_successfully waits for exit code 0. Optional dependencies marked required: false are skipped with a warning if they never reach the target state."
sources: [pkg/compose/dependencies.go:78, pkg/compose/convergence.go:81]
```

```
repo: "openai/whisper"
prompt: "How does Whisper detect the spoken language in multilingual audio? Walk through the language detection tokens and how the model selects the correct language before transcription begins."
answer: "When no language is specified, transcribe() extracts the first 30s of mel spectrogram and calls detect_language, which runs a single-token forward pass on the ⟨startoftranscript⟩ token, masks all non-language logits, and picks the most probable language via argmax. The detected token is written into the decoder buffer at sot_index + 1, giving the model the correct language context from the very first generation step."
sources: [whisper/decoding.py:18, whisper/transcribe.py:43]
```

### Security Review

```
repo: "redis/redis"
prompt: "Review Redis's ACL security model. How are per-user command permissions enforced on each request, and how does AUTH prevent privilege escalation?"
answer: "Every command passes through ACLCheckAllPerm() in processCommand() before execution. Each user owns selectors containing a command bitmap, key-pattern globs with read/write/channel granularity, and pub/sub channel restrictions. AUTH binds the client to a concrete user object, and ACL-modifying commands like ACL SETUSER are themselves ACL-gated — so a limited user cannot escalate its own privileges."
sources: [src/acl.c:1694, src/server.c:processCommand]
```

```
repo: "auth0/node-jsonwebtoken"
prompt: "How does jsonwebtoken's verify() prevent algorithm confusion attacks? Walk through how it validates the alg header, enforces the allowlist, and prevents key/algorithm mismatches."
answer: "verify() builds a default algorithm allowlist based on key type — HS* for secrets, RS*/PS* for RSA, ES* for EC — preventing a public-key token from being verified as symmetric. It checks the token's header alg against this list, validates that the key's crypto type matches the algorithm family, then calls validateAsymmetricKey() as a final guard before any cryptographic work begins."
sources: [verify.js:44, lib/validateAsymmetricKey.js]
```

### Code Quality and Evaluation

```
repo: "vitejs/vite"
prompt: "How does Vite's plugin system compare architecturally to Rollup's? What are the Vite-specific hooks, and what tradeoffs does the design introduce?"
answer: "Vite extends Rollup's plugin interface with dev-server-specific hooks — config, configResolved, configureServer, handleHotUpdate, and transformIndexHtml — none of which exist in Rollup. During dev it skips output-generation hooks entirely since it never calls bundle.generate(), which speeds up HMR but means some Rollup plugins won't work in dev mode. Per-environment plugin instances isolate state across dev/build/SSR at the cost of higher memory usage."
sources: [packages/vite/src/node/plugin.ts, packages/vite/src/node/server/pluginContainer.ts]
```

```
repo: "evanw/esbuild"
prompt: "How does esbuild achieve such fast build speeds? What parallelism strategy does the bundler use across parsing, linking, and code generation?"
answer: "esbuild runs three concurrent phases: parsing launches a goroutine per module via parseFile with results streamed on a channel, linking computes cross-chunk dependencies in parallel using a sync.WaitGroup per chunk, and code generation emits each output chunk in its own goroutine. The only synchronization points are WaitGroup barriers between phases, yielding near-linear scaling with core count."
sources: [internal/bundler/bundler.go:1625, internal/linker/linker.go:603]
```

### Deep Technical Analysis

```
repo: "ggml-org/llama.cpp"
prompt: "How does llama.cpp's KV cache work during autoregressive generation? How are past key-value pairs stored, reused across tokens, and evicted when the context window fills up?"
answer: "The KV cache allocates per-layer K/V tensors in a circular buffer tracked by llama_kv_cells. On each step, find_slot() locates free or reusable cells, and apply_ubatch() writes new key-value pairs into the selected positions. When the context fills, seq_rm() evicts cells outside the current window, and for rotary models a K-shift graph updates keys in-place to support sliding-window attention."
sources: [src/llama-kv-cache.cpp:704, src/llama-kv-cache.cpp:903]
```

```
repo: "tinygrad/tinygrad"
prompt: "How does tinygrad's lazy evaluation system work? When I write tensor operations, how does it build the computation graph and when does it actually execute on hardware?"
answer: "Every tensor operation calls _apply_uop which links a new UOp node to its inputs — no memory is allocated and is_realized stays False. Calling realize() triggers the full pipeline: the scheduler linearizes the UOp DAG into an ordered kernel schedule, si_lowerer compiles each kernel to device-specific code (CUDA, Metal, OpenCL), and run_schedule launches the compiled runners on the target backend."
sources: [tinygrad/tensor.py:78, tinygrad/engine/schedule.py:20]
```
