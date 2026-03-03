# Testing

## Overview

All tests are Storybook integration stories with inline `.test()` assertions. There are no standalone `*.test.ts` files.

The default stabilization strategy is:

- Loaded-state stories: `play: () => I.waitExit(role('status'))`
- Loading-state stories: do not wait for exit; assert loading UI directly
- `.wait()` exists and is still supported, but should be rare and used for edge cases

## Running tests

Preferred command for a specific file:

```bash
mise run test:run <file>
```

Examples:

```bash
mise run test:run src/app/integration/Articles.stories.tsx
mise run test:run src/app/integration/Connections.stories.tsx
```

Project-wide commands:

```bash
bun run test           # watch mode
bun run test:run       # single run (CI)
bun run test:coverage  # single run + coverage report
```

## Read The Source First

Use these files as the primary documentation.

| File                                          | Why read it                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/shared/test/actor.ts`                    | Base actor API (`I.see`, `I.click`, `I.waitExit`, `I.scope`, `I.resolveLocator`)      |
| `src/shared/test/loc.ts`                      | Locator DSL (`role`, `text`, `heading`, `.wait()`, `.maybe()`, `.all()`, `.within()`) |
| `src/shared/test/actor.test.stories.tsx`      | Focused examples of scoping and locator behavior                                      |
| `src/app/integration/Articles.stories.tsx`    | Canonical master-detail integration patterns (default, error, loading, detail states) |
| `src/app/integration/Connections.stories.tsx` | Advanced master-detail and mobile navigation coverage                                 |
| `src/app/integration/Dashboard.stories.tsx`   | Simple page with success/error/loading variants                                       |
| `src/pages/articles/testing.ts`               | Page actor style for master-detail pages                                              |
| `src/pages/dashboard/testing.ts`              | Page actor style for simple pages                                                     |
| `src/entities/article/mocks/handlers.ts`      | `default` / `error` / `loading` handler variants                                      |
| `src/app/mocks/handlers.ts`                   | Central default MSW handler registry                                                  |
| `src/shared/mocks/utils.ts`                   | Shared mock helpers (`to500`, `neverResolve`, etc.)                                   |

## Story Conventions

### Naming

| Variant                | Name pattern                               |
| ---------------------- | ------------------------------------------ |
| Happy path (desktop)   | `Default`                                  |
| Happy path (mobile)    | `Default (Mobile)`                         |
| Error state            | `<Feature> Load Server Error`              |
| Error state (mobile)   | `<Feature> Load Server Error (Mobile)`     |
| Loading state          | `<Feature> Request Loading State`          |
| Loading state (mobile) | `<Feature> Request Loading State (Mobile)` |

Mobile test titles still use `[mobile]` prefix in `.test(...)` names.

### Stabilization rules

1. For loaded-state stories, add `play: () => I.waitExit(role('status'))`.
2. Apply the same rule to async error stories where UI appears after initial request resolution.
3. For stories that intentionally keep loading visible (`*.loading` handlers), do not use `waitExit` for that loading target.
4. For detail requests triggered by user action, click first, then wait for the relevant status to exit, then assert detail content.

## Actor and Locator Guidance

The actor is codecept-style and should stay declarative. Extend per-page actors in `src/pages/<page>/testing.ts`.

Key base methods:

- `I.see(locator)`
- `I.dontSee(locator)`
- `I.waitExit(locator)`
- `I.click(locator)`
- `I.fill(locator, value)`
- `I.selectOption(locator, value)`
- `I.scope(locator, callback)`
- `I.resolveLocator(locator)`

### When to use `.wait()`

Use `.wait()` only for edge cases where `I.waitExit(role('status'))` is not the right tool.

Common valid cases:

- Asserting loading UI appears: `await I.see(role('status', 'Loading ...').wait())`
- Local async transitions without a stable status-exit contract
- Targeted component stories that intentionally wait for post-interaction async recalculation (for example, price list extraction in `src/pages/items/ui/ItemsPage.stories.tsx`)

If a loaded-state integration story can be stabilized with `play: () => I.waitExit(role('status'))`, prefer that over locator `.wait()` calls.

## MSW Structure

Each entity exposes handlers in `src/entities/<entity>/mocks/handlers.ts`:

- `.default`: successful response (usually with delay)
- `.error`: failing response
- `.loading`: never resolves

Default handlers are aggregated in `src/app/mocks/handlers.ts` and used by Storybook preview. Story-level overrides replace only specific keys.

## Responsive Testing

Mobile stories use Storybook viewport globals:

- `globals: { viewport: { value: 'sm', isRotated: false } }`

To reuse desktop configuration in mobile variants, pass `parameters: DesktopStory.input.parameters`.

## Coverage

Coverage uses `@vitest/coverage-v8`.

Thresholds:

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 80%       |
| Functions  | 80%       |
| Branches   | 75%       |
| Statements | 80%       |

Excluded from coverage:

- `*.stories.tsx`
- `*.test.{ts,tsx}`
- `src/shared/styled-system/`
- `src/shared/components/ui/`
- `src/main.tsx`

## Adding a New Page Test

1. Create typed mock data in `src/entities/<entity>/mocks/data.ts`.
2. Add `default` / `error` / `loading` handlers in `src/entities/<entity>/mocks/handlers.ts`.
3. Register defaults in `src/app/mocks/handlers.ts`.
4. Create `src/pages/<page>/testing.ts` with page actor methods.
5. Add `src/app/integration/<Page>.stories.tsx` with `Default`, `Default (Mobile)`, error, and loading variants.
6. Add `play: () => I.waitExit(role('status'))` to loaded-state and async error variants, but not to persistent-loading stories.
