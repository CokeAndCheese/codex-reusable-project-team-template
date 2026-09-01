# {{PROJECT_NAME}} — Project Instructions

> 本文件复制到目标项目根目录并命名为 `AGENTS.md` 后生效。替换全部 `{{...}}` 占位符后再开始研发。

## Required context

Before substantial work, read:

1. `docs/PRODUCT_MANAGER_CHARTER.md` for governance and decision authority.
2. `docs/ORG_CHART.md` for the latest effective and proposed organization structure.
3. `docs/PRODUCT_CONTEXT.md` for current product, architecture, risks, team, and milestones.
4. `docs/DECISION_LOG.md` for approved decisions that must survive chat compaction.
5. `docs/DEVELOPMENT_WORKFLOW.md` for workspace, Git, write-queue, and backup rules.
6. The source contracts and tests for the module in scope.

Conflict priority: newest explicit user instruction, then this file, then the Product Manager Charter, then Product Context, then older documents or chats. Report material conflicts to `{{PROJECT_NAME}}产品经理-项目总控`.

## Governance

- `{{PROJECT_NAME}}产品经理-项目总控` is the sole product-management and cross-role coordination task for this repository.
- The user receives decision questions, material risks, staffing changes, milestone outcomes, and release recommendations—not routine engineering coordination.
- After the user approves a decision, the product manager owns decomposition, staffing, sequencing, coordination, evidence review, and acceptance.
- Other role tasks work only within their assigned responsibility and report dependencies, risks, evidence, and blockers to the product manager.
- Product scope, irreversible architecture choices, material risk acceptance, external publication, production deployment, destructive actions, and release approval require explicit user authority.

## Team operations

- Name personnel tasks as `职责-分工内容`, for example `前端工程师-交互体验`. Distinguish additional people by concrete work content, not numbers. The sole naming exception is the project manager task: `{{PROJECT_NAME}}产品经理-项目总控`.
- The product manager may propose creating, splitting, merging, or retiring personnel tasks. Every staffing change must be reported to the user with the change, reason, impact, and expected cost; never change staffing silently.
- For each approved work package, first match and dispatch it to an existing long-lived role task. Established role conversations take precedence over temporary sub-agents.
- A temporary sub-agent is allowed only when no suitable long-lived role exists, a fresh one-time independent review is required, the role is unavailable or constrained, or isolation has explicit value. It must map to an existing responsibility and report results back to the corresponding long-lived role or product manager.
- Before dispatch, record the long-lived role owner. Before using a temporary sub-agent, also record why the role is unsuitable, the mapped responsibility, and the result-sync destination. Missing fields close the dispatch gate.
- The product manager retains work decomposition, scheduling, write-queue control, conflict resolution, integration acceptance, and user reporting.
- Keep a project-local role Chat registry with task IDs, responsibility, current status, and last handoff. An idle role remains part of the approved organization unless a staffing change is approved.
- Before archiving or retiring a role Chat, consolidate durable decisions, facts, evidence, risks, and ownership into repository records; never delete the only copy of project context.
- Assign one owner per mutable file or system boundary. Preserve unrelated user and role changes.
- All development uses the single saved checkout `{{WORKSPACE_PATH}}`. Do not create or use extra worktrees.
- Only one implementation task and one local task branch may write at a time. Read-only research and review may run in parallel.
- Use local task branches with prefix `{{TASK_BRANCH_PREFIX}}`. Merge to local `{{DEFAULT_BRANCH}}` only after relevant verification and product acceptance.
- Default remote policy is local-only: do not fetch, pull, push, create PRs, inspect remote branches, deploy, publish, or change external state without explicit project-specific authorization.

## Repository safeguards

- Protected paths: `{{PROTECTED_PATHS}}`.
- Public or cross-project contract paths: `{{CONTRACT_PATHS}}`.
- Do not silently change a published contract's fields, enums, IDs, units, coordinates, discovery, or binding semantics. Breaking changes require a new version, producer/consumer impact review, synchronized fixtures and validators, migration/rollback planning, and user approval.
- Use exact-path staging. Never use broad staging such as `git add .`.
- Never clean, reset, move, overwrite, or delete unrelated work, branches, backups, assets, credentials, or user changes.
- Do not expose secrets in chat, logs, documents, commits, test fixtures, or backups.

## Verification and records

- Verify work in proportion to risk and provide reproducible evidence before declaring completion.
- Primary project gate: `{{PRIMARY_VERIFY_COMMAND}}`.
- Update `docs/PRODUCT_CONTEXT.md` when product facts, architecture, risks, team, or milestones materially change.
- Update `docs/ORG_CHART.md` immediately when a credible organization proposal appears or an approved role/responsibility/reporting change takes effect. Keep proposed and effective structures separate.
- Append to `docs/DECISION_LOG.md` when the user approves, reverses, or replaces a durable product, architecture, staffing, risk, workflow, or release decision.
- Update `docs/PRODUCT_MANAGER_CHARTER.md` only when product-manager authority, reporting, or operating model changes.
- At each accepted milestone, follow `docs/DEVELOPMENT_WORKFLOW.md`, create the authorized local milestone commit, then ask the user to confirm the external manual backup before starting the next high-risk milestone.
