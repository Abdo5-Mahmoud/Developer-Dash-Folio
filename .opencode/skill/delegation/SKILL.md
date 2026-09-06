---
name: delegation
description: Classify task complexity, route work to the cheapest sufficient agent/model (explore/general/review/deep subagents on free B.ai Flash or OpenCode Zen free models), escalate only when justified, and verify delegated output against project rules. Use when deciding whether to delegate a task, choosing a subagent for the Task tool, triaging findings from a delegated agent, or when a delegated result fails verification.
---

# Delegation

Routing protocol for this workspace. Source of truth: `AGENTS.md` (working rules) and `PRODUCT.md` (business decisions and scope). Delegation never overrides either.

## Prime directive

Delegate execution, never judgment. The orchestrator (primary agent) owns classification, scope, verification, and the final report. A subagent's output is an unverified proposal until checked against the working tree and project docs. "Do not trust previous agent reports without verifying the working tree" (AGENTS.md).

## When NOT to delegate

- Reading a known file, one mechanical edit, or answering from context already loaded: do it directly.
- A subagent starts with fresh context and pays that cost again. Delegate only for search fan-out, bounded implementation units, or parallelizable work.

## 1. Classify before routing

| Tier | Signals | Examples |
| --- | --- | --- |
| Simple | read-only, mechanical, single-file, verifiable by inspection | "where is X defined", rename, copy tweak, version check |
| Standard | bounded change inside one feature, clear acceptance check | bug fix in one component, add a test, wire an existing helper |
| Deep | cross-feature, architecture, auth/data integrity, migration, concurrency, ambiguous product behavior | schema change, admin auth flow, state-model refactor |
| Educational | the owner's goal is to learn (this repo is a learning portfolio) | "explain how auth works", "why does this layout break" |

Uncertainty rule: if you cannot name the files a task touches, it is at least Standard. If you cannot state the acceptance check, it is Deep until clarified with the user.

## 2. Route to the cheapest sufficient model

The Task tool selects a subagent, not a model. Each subagent's model is fixed in `opencode.json` (`agent.<name>.model`). Current mapping (OpenCode Zen free tier — `bai` suspended, see note below):

| Tier | Route | Model (per opencode.json) |
| --- | --- | --- |
| Simple | `explore` subagent | `opencode/nemotron-3.5-lightning-free` (fallback `opencode/ling-3.0-flash-fin-free`) |
| Standard | `general` subagent | `opencode/big-pickle` (fallback `opencode/mimo-v2.5-free`) |
| Review / second opinion | `review` subagent | `opencode/muse-spark-1.3-contributor-free` (fallback `opencode/nemotron-3-ultra-free`) |
| Deep / context-heavy | primary agent directly; `deep` subagent (`opencode/nemotron-3-ultra-free`) when more context is needed | current session model |

> `bai` status 2026-09-04: key still valid (`GET /v1/models` → 200, all six configured IDs present), but inference is dead — `POST /v1/chat/completions` returns `400 insufficient_user_quota` (`balance=0 required=6`). Free-trial credits exhausted. The `bai` provider block stays in `opencode.json` so routing can move back after a top-up; until then do not route to `bai/*`. Re-probe with a 10-token request before trusting it again.
>
> Zen serving probe 2026-09-04: `nemotron-3.5-lightning-free` → 200 (serving); `big-pickle` / `mimo-v2.5-free` → 429 `FreeUsageLimitError` (per-minute free-tier throttle, retry later); `ling-3.0-flash-fin-free` → 503 upstream unavailable (transient). Zen 429/503s are throttles, not death like `bai` balance=0 — retry or fall back within the table, don't abandon the tier.

### 2b. OpenCode Zen free models (verified 2026-09-04)

Source of truth is live, because the Zen free set rotates (limited-time promos come and go). Refresh before routing:

```sh
opencode models | grep -i free
```

Cross-checked against the Zen pricing table (`https://opencode.ai/docs/zen/`, every row Free/Free/Free). Config IDs use the `opencode/<model-id>` format. Non-`-free` IDs that are actually paid — do NOT treat as free: `opencode/gpt-5-nano` ($0.05/$0.40 per 1M), `opencode/minimax-m2.5`, `opencode/qwen3.6-plus`, `opencode/deepseek-v4-flash` (peak/off-peak pricing).

| Tier | Route | Zen free model (`agent.<name>.model`) | Why this seat |
| --- | --- | --- | --- |
| Simple (search fan-out) | `explore` subagent | `opencode/nemotron-3.5-lightning-free` (fallback `opencode/ling-3.0-flash-fin-free`) | Latency-optimized; explore fans out many parallel read-only calls, so speed beats depth |
| Standard (bounded build) | `general` subagent | `opencode/big-pickle` (fallback `opencode/mimo-v2.5-free`) | Balanced coding model for single-feature implementation units |
| Review / second opinion | `review` subagent | `opencode/muse-spark-1.3-contributor-free` (fallback `opencode/nemotron-3-ultra-free`) | Different model family than the implementer, so the second opinion is independent, not correlated |
| Deep / context-heavy | `deep` subagent | `opencode/nemotron-3-ultra-free` (fallback `opencode/muse-spark-1.2-contributor-free`) | Largest model in the free set for overflow context; primary agent still handles genuinely Deep work directly |

Privacy: every Zen free model carries limited-time data-use terms (docs → Privacy): Big Pickle / MiMo-V2.5 / Ling 3.0 may use data for training; Nemotron frees are NVIDIA trial endpoints (no personal/confidential data); Muse Spark contributor-frees train future Meta models in exchange for the discount. Never route secrets through them; prefer paid/zero-retention models for sensitive code when asked.

To actually route a tier to Zen, set `agent.<name>.model` in `opencode.json` (e.g. `"explore": { "model": "opencode/nemotron-3.5-lightning-free", ... }`) and restart opencode — model choice is per-agent config, not per-call.

## 3. Escalation ladder (only on observed need)

1. Failed once: usually a prompt problem. Add the missing context (file paths, acceptance check, constraints) and retry the same tier.
2. Failed twice or scope turns out larger: split into smaller units and re-classify.
3. Still failing or genuinely Deep: primary agent handles it directly.
4. Frontier/paid model (e.g. `opencode/claude-*`, `opencode/gpt-5*`): only on explicit user request, never silently.

Never escalate because a Flash model "might" be worse. Escalate on observed failure or architectural need.

## 4. Delegation contract (every Task prompt must include)

1. Source of truth: "Read `AGENTS.md` and `PRODUCT.md`. Product scope and documented decisions are fixed. Do not change them; if the task appears to require a scope change, stop and report instead."
2. Inspect first: "Read the actual files involved before proposing or editing. Do not trust prior reports or this prompt's assumptions about the code."
3. Smallest safe implementation: no new dependencies, no new abstractions, no unrelated refactors (AGENTS.md).
4. Report format: files touched, exact commands run with results, each finding classified (see §5), open uncertainties.
5. Educational tasks: return reasoning with `file:line` references, not just a diff. The owner makes the decisions; the agent explains.

## 5. Triage delegated findings

Classify every finding before acting on it:

- **Bug** — demonstrable wrong behavior against the code or `PRODUCT.md`. Fix.
- **Improvement** — correct today, better another way. Only act if the task asked.
- **Preference** — style opinion with no project rule behind it. Reject unless `AGENTS.md`/`PRODUCT.md` states it.
- **Outdated documentation** — code is correct, docs lag. Update docs, not code.
- **False positive** — does not reproduce in the working tree. Drop it and note why.

Verify by reproducing, not by arguing. A finding that cannot be reproduced is a false positive until proven.

## 6. Verification after delegation (never skipped)

Performed by the orchestrator, not the subagent:

- `git status` / `git diff` — actual changed files must match the report.
- `npx tsc --noEmit` — when code changed.
- `npm test` (jest) — when tests or tested logic changed.
- `npm run build` — when relevant (AGENTS.md).
- Report only verified results.

## 7. Large-review fan-out (whole codebase exceeds one agent's context)

Never send one agent to "review everything". Split by area into bounded, parallelizable units — one `explore` (read-only) per unit, each with its own scope and acceptance check. Then a `review` subagent cross-checks the combined findings, and the orchestrator verifies against the tree (§6).

Default split for this repo (adjust scopes to the task):

| # | Scope | Agent | Bounded brief |
| --- | --- | --- | --- |
| 1 | `app/api/**`, `proxy.ts`, `lib/auth.ts`, `lib/session.ts`, `lib/rate-limiter.ts` | `explore` | Trust boundaries: auth, validation, rate limits. Report each finding with `file:line` + reproduction |
| 2 | `features/*/lib/**`, `features/*/data/**`, `lib/mongodb.ts`, `lib/models/**` | `explore` | Data integrity: queries, nullability, N+1, connection handling |
| 3 | `app/**` pages/layouts, `components/**`, `features/*/components/**` | `explore` | UI correctness: loading/error states, a11y, responsive behavior |
| 4 | `__tests__/**`, `jest.config.ts`, `scripts/**` | `explore` | Test coverage gaps vs. changed logic; no new tests without asking |
| 5 | `*.config.*`, `opencode.json`, `.opencode/**`, `AGENTS.md`, `PRODUCT.md` | primary (fast) | Config/docs drift — small enough to read directly, do not delegate |

Rules: units run in parallel; each returns findings only (no edits — `explore` is read-only by design); cap each brief at ~5 files of focus so output stays verifiable; overlapping claims between units are flagged, not merged, for the orchestrator to triage per §5. If the combined report still overflows, split the largest unit, never widen the agent.

## Environment limits

- Model choice is per-agent config, not per-call. To change a tier's model, edit `agent.<name>.model` in `opencode.json` and restart opencode (config is not hot-reloaded).
- Delegated agents resolve to Zen free models (§2 table): explore → `opencode/nemotron-3.5-lightning-free`, general → `opencode/big-pickle`, review → `opencode/muse-spark-1.3-contributor-free`, deep → `opencode/nemotron-3-ultra-free`. Verify with `opencode models | grep -i free`.
- Zen free set rotates: verify with `opencode models | grep -i free` before routing, and re-check the pricing table at `https://opencode.ai/docs/zen/` when a model disappears or a new `-free` ID appears.
- Subagents cannot ask the user questions mid-run; every constraint must be in the delegation prompt.
- Skills are advisory. Hard enforcement exists only via permissions (`explore` is read-only by design; set `permission.edit: deny` on review-only agents).
