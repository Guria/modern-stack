# Testing

## Overview

All tests are integration tests written as Storybook stories with inline `.test()` assertions. There are no standalone `*.test.ts` files — every test is co-located with the component it verifies and runs inside a real browser via Playwright.

**Stack:** Vitest · Storybook 10 · Playwright · MSW (Mock Service Worker)

## Running tests

```bash
bun run test           # watch mode
bun run test:run       # single run (CI)
bun run test:coverage  # single run + coverage report
```

To run tests for a specific file pattern:

```bash
mise run test:run Articles    # runs all files matching "Articles"
mise run test:run Dashboard   # runs all files matching "Dashboard"
```

## Architecture

```
src/
├── shared/
│   ├── test/
│   │   ├── loc.ts                 # Locator types, fluent API, shorthand factories
│   │   ├── actor.ts               # Actor framework (createActor, I.see, I.click, etc.)
│   │   └── index.ts               # Barrel re-export
│   └── mocks/
│       ├── utils.ts               # HTTP error classes, neverResolve(), getParam()
│       └── index.ts               # Barrel re-export
├── entities/
│   └── <entity>/mocks/
│       ├── data.ts                # Typed mock data arrays
│       └── handlers.ts            # MSW handlers (.default, .error, .loading)
├── app/
│   ├── mocks/handlers.ts          # Central handler registry
│   ├── mocks/browser.ts           # MSW browser worker setup
│   └── integration/*.stories.tsx  # Integration test stories
└── pages/
    └── <page>/testing.ts          # Per-page locators + actor extensions
```

## Story file structure

Every integration story follows the same pattern:

```tsx
import preview from '#.storybook/preview'
import { App } from '#app/App'
import { dashboardStats } from '#entities/dashboard/mocks/handlers'
import { dashboardActor as I, dashboardLoc as loc } from '#pages/dashboard/testing'
import { text } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Dashboard',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders dashboard heading', async () => {
	await I.see(loc.heading.wait())
	await I.see(text('Total Revenue'))
})
```

Key points:

- Use `preview.meta()` — not raw Storybook `Meta` objects.
- Set `initialPath` to the route the page renders at.
- Initialize the actor in `loaders` so it has access to the Storybook context.
- Call `meta.story()` to create story variants, then chain `.test()` for assertions.

### Story naming conventions

| Variant                | Name pattern                               | Example                                  |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| Happy path (desktop)   | `Default`                                  | `meta.story({ name: 'Default' })`        |
| Happy path (mobile)    | `Default (Mobile)`                         | `globals: { viewport: { value: 'sm' } }` |
| Error state            | `<Feature> Load Server Error`              | `Articles Load Server Error`             |
| Error state (mobile)   | `<Feature> Load Server Error (Mobile)`     | —                                        |
| Loading state          | `<Feature> Request Loading State`          | `Dashboard Request Loading State`        |
| Loading state (mobile) | `<Feature> Request Loading State (Mobile)` | —                                        |

The title passed to `.test('name', ...)` for mobile variants must be prefixed with `[mobile]`. The story display name passed to `meta.story({ name: '...' })` uses a `(Mobile)` suffix instead — the `[mobile]` prefix does **not** apply there.

```ts
// Test title — use [mobile] prefix
DefaultMobile.test('[mobile] shows article list when no article is selected', async () => { ... })

// Story display name — use (Mobile) suffix, no [mobile] prefix
export const DefaultMobile = meta.story({ name: 'Default (Mobile)', globals: { viewport: { value: 'sm' } } })
```

## Actor pattern

Tests use an actor-based API inspired by [CodeceptJS](https://codecept.io/). The actor (`I`) provides a fluent, human-readable interface.

### Built-in actor methods

The base actor (`createActor()`) provides:

| Method                           | Purpose                                      |
| -------------------------------- | -------------------------------------------- |
| `I.see(locator)`                 | Assert element is in the document            |
| `I.dontSee(locator)`             | Assert element is absent (calls `.maybe()` internally) |
| `I.seeInField(locator, value)`   | Assert input has value                       |
| `I.click(locator)`               | Click an element                             |
| `I.fill(locator, value)`         | Type into an input (replaces existing value) |
| `I.selectOption(locator, value)` | Open a select and choose an option           |
| `I.clear(locator)`               | Clear an input field                         |

**Deprecated methods** (do not use):
- `I.seeText()` / `I.dontSeeText()` — use `I.see(text(...))` instead

### Extending actors

Each page defines its own actor by extending the base with domain-specific methods:

```tsx
// src/pages/dashboard/testing.ts
import { button, createActor, heading, role, text } from '#shared/test'

export const dashboardLoc = {
	heading: heading('Dashboard'),
}

export const dashboardActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load dashboard').wait())
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading dashboard page').wait())
		await I.dontSee(role('alert'))
	},
	seeDashboardContent: async () => {
		await I.see(dashboardLoc.heading.wait())
		await I.see(text('Total Revenue'))
		await I.see(text('Active Users'))
	},
}))
```

**Guidelines:**
- Use `.wait()` only on the **first** locator in each method to ensure the page has loaded
- Subsequent locators in the same method can be synchronous (no `.wait()`)
- Only define locators in the `Loc` object if they are:
  - Used multiple times across methods, OR
  - Exported and used in story files
- Simple shortcuts like `role('main')` or `button('Submit')` should be inlined directly — no need to extract to `Loc`

## Locators

### Fluent locator API

All locators support a fluent API with `.wait()`, `.maybe()`, and `.all()` modifiers:

```tsx
import { text, role, heading } from '#shared/test'

// Synchronous (getBy) - throws if not found
text('Dashboard')
role('heading', 'Dashboard')

// Async (findBy) - waits for element
text('Dashboard').wait()
role('heading', 'Dashboard').wait()

// Maybe (queryBy) - returns null if not found
text('Dashboard').maybe()

// All (getAllBy/findAllBy) - returns array
text('Active').all()
text('Active').all().wait()
```

**Pattern for loading checks:**
```tsx
await I.see(role('status', 'Loading page').wait())  // First check: wait for page
await I.dontSee(role('alert'))                      // Subsequent: no .wait() needed
```

### Shorthand factories

Common patterns have shorthand factories in `#shared/test`:

| Factory                   | Equivalent                                                             |
| ------------------------- | ---------------------------------------------------------------------- |
| `heading('Dashboard')`    | `role('heading', 'Dashboard')`                                         |
| `button('Submit')`        | `role('button', 'Submit')`                                             |
| `link(/Settings/i)`       | `role('link', /Settings/i)`                                            |
| `text('$0/mo')`           | Direct text matcher                                                    |
| `backButton('articles')`  | `(canvas) => canvas.findByLabelText('Back to articles')`               |

All factories accept `string | RegExp`.

**Examples:**
```tsx
import { button, heading, link, text, role } from '#shared/test'

export const articlesActor = createActor().extend((I) => ({
	seeArticleList: async () => {
		await I.see(link(/Quarterly report/i).wait())  // First: .wait()
		await I.see(link(/Hiring plan/i))              // Rest: no .wait()
	},
	seeStatusBadges: async () => {
		await I.see(text('Done').all().wait())   // First .all(): .wait()
		await I.see(text('In Progress').all())   // Rest: no .wait()
	},
}))
```

### Using `loc()` for custom locators

For queries not covered by shortcuts, use `loc()` directly:

```tsx
import { loc } from '#shared/test'

const customLocator = loc((canvas) => canvas.findByRole('status', { name: 'Custom' }))
```

**When to use `loc()`:**
- Custom roles or uncommon ARIA patterns
- Queries needing extra options (`{ selector }`, `{ current }`)
- One-off locators that don't warrant a factory

### Scoping with `.within()`

Locators can be scoped to a parent element:

```tsx
const detail = await I.see(role('main'))
await I.see(heading('Quarterly report').wait().within(detail))
await I.see(text(/Regional performance/).within(detail))
```

## Locator organization

**Only export locators used multiple times or in stories:**

```tsx
// Good: used in stories
export const dashboardLoc = {
	heading: heading('Dashboard'),  // Used in multiple stories
}

// Bad: single-use locators
export const dashboardLoc = {
	loadingState: role('status', 'Loading dashboard page'),  // Only used once in seeLoading()
	errorHeading: heading('Could not load dashboard'),       // Only used once in seeError()
}
```

**Inline single-use locators:**

```tsx
export const dashboardActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load dashboard').wait())  // Inline
		await I.see(role('alert'))                               // Inline
		await I.see(button('Try again'))                         // Inline
	},
}))
```

**Simple shortcuts don't add semantic value:**

```tsx
// Bad: wrapper adds no meaning
export const articlesLoc = {
	detailRegion: role('main'),  // Just use role('main') directly
}

// Good: inline it
const detail = await I.see(role('main'))
```

## MSW mock handlers

Each entity provides mock handlers in `src/entities/<entity>/mocks/handlers.ts` with three variants:

```tsx
import { HttpResponse, delay, http } from 'msw'

export const articleList = {
	default: http.get(url, async () => {
		await delay()
		return HttpResponse.json(articlesMockData)
	}),
	error: http.get(url, () => to500()),
	loading: http.get(url, neverResolve),
}
```

| Variant    | Behavior                                           |
| ---------- | -------------------------------------------------- |
| `.default` | Returns mock data after a realistic delay          |
| `.error`   | Returns HTTP 500 (or 404, 400) immediately         |
| `.loading` | Never resolves — keeps the request pending forever |

### Central handler registry

All default handlers are aggregated in `src/app/mocks/handlers.ts`:

```tsx
export const handlers = {
	articleList: articleList.default,
	articleDetail: articleDetail.default,
	dashboardStats: dashboardStats.default,
	// ...
} satisfies Record<string, RequestHandler | RequestHandler[]>
```

This object is used as the default MSW configuration for all stories via `parameters.msw.handlers` in the Storybook preview.

### Per-story handler overrides

Override specific handlers to test error or loading states:

```tsx
export const HandlesArticlesLoadServerError = meta.story({
	name: 'Articles Load Server Error',
	parameters: {
		msw: {
			handlers: { articleList: articleList.error },
		},
	},
})
```

Only the overridden key is replaced — all other handlers keep their defaults.

### Mock data

Mock data lives in `src/entities/<entity>/mocks/data.ts` as typed arrays:

```tsx
import type { Article } from '#entities/article/model/types'

export const articlesMockData = [
  { id: '1', title: 'Quarterly report', status: 'done', content: [...] },
  // ...
] satisfies Article[]
```

### Mock utilities (`src/shared/mocks/utils.ts`)

| Export            | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `to400(msg?)`     | Throw an HTTP 400 error                       |
| `to404(msg?)`     | Throw an HTTP 404 error                       |
| `to500(msg?)`     | Throw an HTTP 500 error                       |
| `neverResolve()`  | Return a promise that never settles           |
| `getParam(param)` | Extract a single path param from MSW's params |

## Responsive testing

Mobile variants set a viewport via Storybook globals:

```tsx
export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})
```

Available breakpoints match Panda CSS defaults:

| Name  | Width            |
| ----- | ---------------- |
| `sm`  | 640px            |
| `md`  | 768px            |
| `lg`  | 1024px           |
| `xl`  | 1280px (default) |
| `2xl` | 1536px           |

To share parameters between desktop and mobile variants of the same state, define the desktop story first and reference its `.input.parameters` in the mobile variant:

```tsx
export const Error = meta.story({
	name: 'Feature Load Server Error',
	parameters: {
		msw: { handlers: { feature: featureMock.error } },
	},
})

export const ErrorMobile = meta.story({
	name: 'Feature Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: Error.input.parameters, // reuse the desktop story's MSW handlers
})
```

## Coverage

Coverage uses v8 provider via `@vitest/coverage-v8`. Thresholds are configured via environment variables and enforced in CI:

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 80%       |
| Functions  | 80%       |
| Branches   | 75%       |
| Statements | 80%       |

Excluded from coverage:

- `*.stories.tsx` files
- `*.test.{ts,tsx}` files
- `src/shared/styled-system/` (generated by Panda CSS)
- `src/shared/components/ui/` (managed by Park UI)
- `src/main.tsx`

## Adding a new page test

1. **Create mock data** in `src/entities/<entity>/mocks/data.ts` — typed array matching the entity type.
2. **Create mock handlers** in `src/entities/<entity>/mocks/handlers.ts` — export `{ default, error, loading }` variants.
3. **Register handlers** in `src/app/mocks/handlers.ts` — add default handlers to the `handlers` object.
4. **Create a testing module** in `src/pages/<page>/testing.ts`:
   - Define actor extensions with domain methods (`seeError`, `seeLoading`, page-specific methods)
   - Only export locators used multiple times or in stories
   - Inline single-use locators directly in methods
5. **Create the story** in `src/app/integration/<Page>.stories.tsx` — define `Default`, `Default (Mobile)`, error, and loading variants with `.test()` assertions.
