# ADR 0004: Documentation Sync Automation

## Status

Accepted

## Context

Documentation in this repository is not a courtesy artifact. It is the primary interface for two of the library's audiences: developers reading the design system to build with the components, and AI coding assistants consuming the packaged skill references to generate correct markup and styles. A component that exists in `src/` but is absent from those documents is, for those audiences, a component that does not exist.

The set of components changes, and every change fans out across several documents in two languages. Documentation drift is invisible in review — nothing fails, the omission simply persists until someone notices a component missing from a reference table. Relying on a checklist that contributors are asked to follow has the failure mode built in.

## Decision

Treat documentation coverage as a build-time invariant and enforce it mechanically.

`scripts/check-docs-sync.mjs` discovers the component set from the source tree rather than from a maintained list: it scans `src/components/` for directories containing a matching `<ComponentName>.tsx`. Every discovered component must then appear as a section in each required document group:

- `docs/design-system/components/*.md` — the canonical English design-system reference.
- `skills/animal-island-ui-style/references/components/*.md` — the reference material shipped with the external style skill; each file here is additionally capped at 200 lines.

Coverage is asserted by heading match per group: the component name must appear as a Markdown section heading somewhere within each group's files, not merely in the prose. A passing mention inside a table or an example does not satisfy the check, because the intent is that every component has a place of its own to document.

The Chinese mirrors under `docs/zh-CN/**` are checked for file-path parity with `docs/**` (every English document must have a mirror and vice versa), and `SKILL.zh-CN.md` must exist and be non-empty; heading-level coverage inside the mirrors is not re-asserted.

The script exits non-zero when anything drifts, listing each missing component heading, each missing or orphaned mirror file, and each oversized skill reference.

Enforcement runs in two places. `npm run check:docs` invokes it directly; `npm run ci` chains it between format checking and linting, so it gates the pipeline. The pre-commit hook in `.githooks/` runs the full `npm run ci`, installed automatically by `npm run setup:hooks` from the `prepare` lifecycle script. Drift therefore fails locally before it can be committed, and fails CI if the hook was bypassed.

## Consequences

- A new component cannot be merged without documentation. The cost of adding one includes its English design-system entry, its skill reference entry, and the Chinese mirrors.
- Coverage is derived from the source tree, so a renamed or removed component surfaces immediately rather than leaving a stale entry to be discovered later.
- Contributors get the failure at commit time with an explicit list of what is missing, not as a review comment days later.
- The pre-commit hook runs the entire CI pipeline — formatting, docs, lint, unit tests, accessibility tests, and the build — so commits are slow. `git commit --no-verify` bypasses it for emergencies; CI still enforces the same checks.
- The check verifies **presence, not accuracy**. A section heading with wrong or empty content passes. Correctness of props, values, and prose remains a review responsibility.
- Adding a new required document means updating the script's document list, otherwise the new document drifts unchecked.
- Parity is enforced at the file level, not semantically: every English document must have a Chinese mirror file and vice versa, but nothing inspects the mirrors' contents — a missing section or an English revision left untranslated goes undetected. Substantive edits must be carried to both languages by hand.

The contributor workflow around this check is described in [development](../development/).
