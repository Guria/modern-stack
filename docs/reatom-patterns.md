# Reatom Patterns

This doc follows the source-first approach in `docs/README.md`.

## Overview

Project Reatom code favors direct reads, explicit names, and inline event wiring in JSX.

## Read Source First

| File                                         | Why read it                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| `src/pages/calculator/ui/CalculatorPage.tsx` | Clear examples of atom/action naming and inline `wrap` handlers |
| `src/pages/items/ui/ItemsPage.tsx`           | Practical `reatomLoc` + UI binding patterns                     |
| `src/pages/settings/ui/SettingsPage.tsx`     | Larger form-style atom usage with inline updates                |
| `src/pages/timer/model/atoms.ts`             | Async action patterns (`sleep`, `withAbort`, change hooks)      |
| `src/shared/model/locale.ts`                 | Extended atom pattern with helpers (`label`, `reatomLoc`)       |
| `AGENTS.md`                                  | Project-wide Reatom conventions enforced for agents             |

## Rules

- Name every Reatom primitive (`atom`, `action`, `computed`, `reatomAsync`, `reatomComponent`).
- Avoid intermediate variables for one-off atom reads.
- Read atoms directly in JSX when only displaying the value.
- Inline `wrap(() => ...)` handlers in JSX; do not pre-bind handler variables unless reuse is meaningful.
- Keep cross-cutting atom extensions close to atom definition (`withParams`, `withLocalStorage`, `withChangeHook`).

## Workflows

### Adding a new atom/action pair

1. Add a named atom near related domain logic.
2. Add named actions that mutate atom state.
3. Use direct atom reads inside action bodies unless consistency across multiple reads requires a snapshot.

### Wiring UI events

1. Use inline `wrap(() => actionCall())` in JSX.
2. Only extract handler helpers when reused in multiple places or needed for readability.

### Reading state in components

1. For display-only values, call the atom inline in JSX.
2. For derived branches used multiple times, compute once locally only when needed for clarity or consistency.

## Edge Cases

- Local snapshots are valid when value consistency across mutations matters in one action.
- If an inline handler becomes hard to read, extract it, but keep naming domain-specific.
- Prefer project conventions in `AGENTS.md` if this doc and local code examples ever conflict.
