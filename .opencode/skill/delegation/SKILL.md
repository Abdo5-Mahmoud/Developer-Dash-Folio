---
name: delegation
description: Classify task complexity, route work to the cheapest sufficient agent/model (explore/general subagents on free Flash models), escalate only when justified, and verify delegated output against project rules. Use when deciding whether to delegate a task, choosing a subagent for the Task tool, triaging findings from a delegated agent, or when a delegated result fails verification.
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

The Task tool selects a subagent, not a model. Each subagent's model is fixed in `opencode.json` (`agent.<name>.model`). Current mapping (B.ai free Flash tier):

| Tier | Route | Model (per opencode.json) |
| --- | --- | --- |
| Simple | `explore` subagent | `bai/deepseek-v4-flash` |
| Standard | `general` subagent | `bai/qwen3.8-flash` |
| Review / second opinion | `review` subagent | `bai/glm-5.3-flash` |
| Deep / context-heavy | primary agent directly; `deep` subagent (`bai/deepseek-v4-flash-vision-exp`, 16k) when more context is needed | current session model |

All mapped models are free Flash models from the `bai` provider. Prefer them; they are sufficient for most work in this repo. `bai/hy3` and `bai/mimo-v2.5` stay available but are not routed.

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

## Environment limits

- Model choice is per-agent config, not per-call. To change a tier's model, edit `agent.<name>.model` in `opencode.json` and restart opencode (config is not hot-reloaded).
- Delegated agents resolve to `bai/*` models: explore → `bai/deepseek-v4-flash`, general → `bai/qwen3.8-flash`, review → `bai/glm-5.3-flash`, deep (16k fallback) → `bai/deepseek-v4-flash-vision-exp`. Verify with `opencode models bai`.
- Subagents cannot ask the user questions mid-run; every constraint must be in the delegation prompt.
- Skills are advisory. Hard enforcement exists only via permissions (`explore` is read-only by design; set `permission.edit: deny` on review-only agents).
