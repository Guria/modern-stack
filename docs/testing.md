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

## Architecture

```
src/
├── shared/
│   ├── test/
│   │   ├── loc.ts                 # Locator types, loc(), and shorthand factories
│   │   ├── actor.ts               # Actor framework (createActor, createBase)
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
├── pages/
│   └── <page>/testing.ts          # Per-page locators + actor extensions
└── widgets/
    ├── data-page/testing.ts       # Reusable data-page actor mixin
    └── master-details/testing.ts  # Reusable master-detail actor mixin
```

## Story file structure

Every integration story follows the same pattern:

```tsx
import preview from '#.storybook/preview'
import { App } from '#app/App'
import { dashboardStats } from '#entities/dashboard/mocks/handlers'
import { dashboardActor as I, dashboardLoc as loc } from '#pages/dashboard/testing'

const meta = preview.meta({
	title: 'Integration/Dashboard',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders dashboard heading', async () => {
	await I.see(loc.headingAppears)
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
| `I.dontSee(locator)`             | Assert element is absent                     |
| `I.seeText(text, within?)`       | Assert text content exists                   |
| `I.dontSeeText(text, within?)`   | Assert text content is absent                |
| `I.seeInField(locator, value)`   | Assert input has value                       |
| `I.click(locator)`               | Click an element                             |
| `I.fill(locator, value)`         | Type into an input (replaces existing value) |
| `I.selectOption(locator, value)` | Open a select and choose an option           |
| `I.clear(locator)`               | Clear an input field                         |

### Extending actors

Each page defines its own actor by extending the base with domain-specific methods:

```tsx
// src/pages/dashboard/testing.ts
import { createActor, loc } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'

export const dashboardLoc = {
	headingAppears: loc((canvas) => canvas.findByRole('heading', { name: 'Dashboard' })),
	...dataPageLoc('dashboard'),
}

export const dashboardActor = createActor()
	.extend(dataPage(dashboardLoc)) // adds seeError(), seeLoading()
	.extend((I) => ({
		seeDashboardContent: async () => {
			await I.see(dashboardLoc.headingAppears)
			await I.seeText('Total Revenue')
			await I.seeText('Active Users')
		},
	}))
```

### Reusable actor mixins

Widget-level testing modules provide composable mixins:

- **`dataPage(locs)`** — adds `seeError()` and `seeLoading()` for pages with standard loading/error states.
- **`masterDetail(entityPlural)`** — adds `goBack()`, `clickItem(name)`, and `seeDetail(name)` for master-detail layouts.

### Locator factories

Widget-level testing modules also export locator factories that generate the standard locator sets expected by the actor mixins above:

**`dataPageLoc(entityName)`** — generates locators for data-fetching pages:

| Locator               | Resolves to                                            |
| --------------------- | ------------------------------------------------------ |
| `loadingStateAppears` | `[role="status"][name="Loading <entityName> page"]`    |
| `errorHeadingAppears` | `[role="heading"][name="Could not load <entityName>"]` |
| `maybeErrorHeading`   | same, but `queryBy` (returns `null` if absent)         |
| `alertRegionAppears`  | `[role="alert"]`                                       |
| `retryButtonAppears`  | `[role="button"][name="Try again"]`                    |

**`masterDetailLoc(entitySingular)`** — generates locators for master-detail pages:

| Locator                     | Resolves to                                               |
| --------------------------- | --------------------------------------------------------- |
| `noSelectionMessageAppears` | text `"No <entitySingular> selected"`                     |
| `detailRegionAppears`       | `[role="main"]`                                           |
| `detailLoading`             | `[role="status"][name="Loading <entitySingular> detail"]` |
| `detailHeading(name)`       | `[role="heading"]` with given name                        |
| `maybeDetailHeading(name)`  | same, but `queryBy`                                       |

**Combining factories** — spread and override as needed:

```tsx
const mdLoc = masterDetailLoc('article')

export const articlesLoc = {
	...dataPageLoc('articles'),
	...mdLoc,
	articleHeading: mdLoc.detailHeading,
	articleDetailLoading: mdLoc.detailLoading,
}
```

When a page's labels don't match the convention (e.g., chat uses "Could not load conversations" not "Could not load chat"), spread the closest factory and override individual locators:

```tsx
export const chatLoc = {
	...dataPageLoc('conversations'), // error heading matches "conversations"
	...mdLoc,
	loadingStateAppears: loc(
		(
			canvas, // but loading label says "chat"
		) => canvas.findByRole('status', { name: 'Loading chat page' }),
	),
}
```

## Locators

Locators are functions that resolve an element from the Storybook canvas. Wrap them with `loc()` to get scoping support:

```tsx
import { loc } from '#shared/test'

const displayAppears = loc((canvas) => canvas.findByRole('status', { name: 'Timer display' }))
```

### Shorthand factories

Common `findByRole` and `findByText` patterns have shorthand factories in `#shared/test`:

| Factory                | Equivalent `loc()`                                                     |
| ---------------------- | ---------------------------------------------------------------------- |
| `heading('Dashboard')` | `loc((canvas) => canvas.findByRole('heading', { name: 'Dashboard' }))` |
| `button('Submit')`     | `loc((canvas) => canvas.findByRole('button', { name: 'Submit' }))`     |
| `link(/Settings/i)`    | `loc((canvas) => canvas.findByRole('link', { name: /Settings/i }))`    |
| `text('$0/mo')`        | `loc((canvas) => canvas.findByText('$0/mo'))`                          |
| `textAll('Active')`    | `loc((canvas) => canvas.findAllByText('Active'))`                      |

All factories accept `string | RegExp`. Use `loc()` directly for queries that need extra options (e.g., `{ selector }`, `{ current }`) or uncommon roles.

```tsx
import { button, heading, text } from '#shared/test'

export const timerLoc = {
	headingAppears: heading('Timer'),
	displayAppears: text('05:00'),
	startButtonAppears: button('Start'),
	resetButtonAppears: button('Reset'),
}
```

### Scoping with `.within()`

Locators can be scoped to a parent element:

```tsx
const detail = await I.see(loc.detailRegionAppears)
await I.see(loc.articleHeading('Quarterly report').within(detail))
await I.seeText(/Regional performance/, detail)
```

### Naming conventions for locators

- `*Appears` — async locators using `findBy*` (waits for element)
- `maybe*` — sync locators using `queryBy*` (returns `null` if absent)
- Parameterized locators are functions returning a `loc()`:
  ```tsx
  articleHeading: (name: string | RegExp) => loc((canvas) => canvas.findByRole('heading', { name }))
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
4. **Create a testing module** in `src/pages/<page>/testing.ts` — define locators and extend the actor with domain methods. Compose with `dataPage()` and/or `masterDetail()` mixins as appropriate.
5. **Create the story** in `src/app/integration/<Page>.stories.tsx` — define `Default`, `Default (Mobile)`, error, and loading variants with `.test()` assertions.
