# Top Panel Improvements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Eliminate duplicated page titles in the desktop header by replacing them with a global search field; add a working theme toggle (system/light/dark) and a GitHub link in the right side of the top panel.

**Architecture:**

- New shared `themePreferenceAtom` + `resolvedThemeAtom` using `reatomEnum`, `reatomMediaQuery`, `withLocalStorage`, `withChangeHook`
- `AppShell` header gets a desktop search input (center) and right-side icon buttons (GitHub, theme)
- Mobile header is unchanged — still shows the page title / conversation context
- `SettingsPage` Appearance section wires to the global `themePreferenceAtom`

**Tech Stack:** React, Panda CSS (`styled`, `css`, responsive `display`), ParkUI (`Input`, `IconButton`), Lucide icons (`Search`, `Sun`, `Moon`, `Monitor`, `Github`), Reatom (`reatomEnum`, `reatomMediaQuery`, `withLocalStorage`, `withChangeHook`, `computed`, `wrap`).

---

## Observed Duplication (desktop)

| Page              | Top bar shows          | Content shows                          |
| ----------------- | ---------------------- | -------------------------------------- |
| Dashboard         | "Dashboard"            | `<h1>Dashboard</h1>`                   |
| Items             | "Items"                | `<h1>Items</h1>`                       |
| Timeline          | "Timeline"             | `<h1>Timeline</h1>`                    |
| Settings          | "Settings"             | `<h1>Settings</h1>`                    |
| Articles (list)   | "Articles"             | `<h3>Articles</h3>` list header        |
| Articles (detail) | article title          | `<h1>{title}</h1>` content             |
| Chat (detail)     | avatar + name + status | same avatar + name + status in content |

After this plan: desktop top bar shows **search field** (center) + **GitHub + theme toggle** (right). Page content keeps its headings as the primary context. Mobile unchanged.

---

## Context

- `AppShell` header rendered in `src/widgets/layout/ui/AppShell.tsx` (lines 96–129)
  - Currently: `[sidebar toggle] [divider] {mobileHeader}` — no right side
  - `mobileHeader` prop is same component for mobile and desktop
- `SettingsPage` has a local `themeAtom = atom('system', 'settings.theme')` — **dummy, not wired to anything**
- PandaCSS `_dark` condition = `.dark &` → add/remove `.dark` class on `document.documentElement`
- All needed Reatom APIs are in `@reatom/core`: `reatomEnum`, `reatomMediaQuery`, `withLocalStorage`, `withChangeHook`, `computed`
- `reatomEnum` creates typed setter actions: `themePreferenceAtom.setSystem()`, `.setLight()`, `.setDark()`

---

## Key Project Patterns

- **No `useState`** — use `useAtom('')` from `@reatom/react`.
- **No `useMemo`** — inline calls.
- **Event handlers that call Reatom actions** must use `wrap()` at the top level.
- **Icon-only buttons** use `IconButton`, not `Button`.
- Color tokens: `gray.11` for muted, semantic `{color}.subtle.bg/fg` for badges.

---

## Task 1: Create shared theme model

**Files:**

- Create: `src/shared/model/theme.ts`

**What to build:**

Two atoms:

1. `themePreferenceAtom` — stores user's raw choice (`'system'` | `'light'` | `'dark'`), persisted to localStorage, applies `.dark` class on change
2. `resolvedThemeAtom` — computed atom: resolves `'system'` → OS preference, otherwise passes through

```typescript
import {
	computed,
	reatomEnum,
	reatomMediaQuery,
	withChangeHook,
	withLocalStorage,
} from '@reatom/core'

const isDarkModeMedia = reatomMediaQuery('(prefers-color-scheme: dark)')

export const themePreferenceAtom = reatomEnum(
	['system', 'light', 'dark'] as const,
	'themePreference',
)
	.extend(withLocalStorage('theme'))
	.extend(
		withChangeHook(() => {
			// withChangeHook fires on raw value change, not computed —
			// use resolvedThemeAtom subscription instead (see below)
		}),
	)

export const resolvedThemeAtom = computed((ctx) => {
	const pref = ctx.spy(themePreferenceAtom)
	if (pref === 'system') return ctx.spy(isDarkModeMedia) ? 'dark' : 'light'
	return pref
}, 'resolvedTheme')
```

The DOM side effect subscribing to `resolvedThemeAtom` is wired in `main.tsx`:

```typescript
// In main.tsx, after context.start():
rootFrame.run((ctx) => {
	ctx.subscribe(resolvedThemeAtom, (theme) => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	})
})
```

**Steps:**

- [ ] Create `src/shared/model/theme.ts` with `isDarkModeMedia`, `themePreferenceAtom`, `resolvedThemeAtom`
  - `themePreferenceAtom`: `reatomEnum(['system','light','dark'] as const, 'themePreference').extend(withLocalStorage('theme'))`
  - `resolvedThemeAtom`: `computed(ctx => ...)` — resolves 'system' via `isDarkModeMedia`
- [ ] Wire DOM side effect in `src/main.tsx`: `rootFrame.run(ctx => ctx.subscribe(resolvedThemeAtom, theme => document.documentElement.classList.toggle('dark', theme === 'dark')))`
  - Import `resolvedThemeAtom` from `'./shared/model/theme'` (or the shared alias if one exists)
- [ ] Run `npm run typecheck` — no errors

---

## Task 2: Redesign AppShell header for desktop

**File:** `src/widgets/layout/ui/AppShell.tsx`

**Current header structure (lines 96–129):**

```
<header display="flex" alignItems="center" gap="2" px h="14" ...>
  [PanelLeft / Menu IconButton]
  [divider: w="1px" h="5" bg="gray.5"]
  {mobileHeader}
</header>
```

**Target structure:**

```
<header ...>
  [PanelLeft / Menu IconButton]
  [divider]
  {mobileHeader} — hide on md+ (display={{ base:'flex', md:'none' }})
  [Search input — show on md+ (display={{ base:'none', md:'flex' }}, flex="1")]
  [spacer: ml="auto"]
  [Github IconButton — display={{ base:'none', md:'inline-flex' }}]
  [theme toggle IconButton — display={{ base:'none', md:'inline-flex' }}]
</header>
```

**Steps:**

- [ ] In `AppShell.tsx`, add `import { Github, Moon, Search, Sun, Monitor } from 'lucide-react'` to existing lucide imports
- [ ] Import `resolvedThemeAtom`, `themePreferenceAtom` from the shared model file
- [ ] Wrap `{mobileHeader}` in `<styled.div display={{ base: 'flex', md: 'none' }} alignItems="center">` to hide it on desktop
- [ ] After the mobileHeader div, add desktop search input (hidden on mobile):
  ```tsx
  <styled.div
  	display={{ base: 'none', md: 'flex' }}
  	alignItems="center"
  	flex="1"
  	gap="2"
  	maxW="480px"
  >
  	<Search className={css({ w: '4', h: '4', color: 'gray.10', flexShrink: 0 })} />
  	<Input
  		placeholder="Search..."
  		size="sm"
  		variant="outline"
  		bg="transparent"
  		borderWidth="0"
  		_focus={{ borderWidth: '0', outline: 'none', boxShadow: 'none' }}
  	/>
  	<styled.kbd fontSize="xs" color="gray.9" flexShrink={0}>
  		⌘K
  	</styled.kbd>
  </styled.div>
  ```
- [ ] Add `<styled.div ml="auto" />` spacer after the search div
- [ ] Add GitHub `IconButton` (desktop only):
  ```tsx
  <IconButton
  	variant="plain"
  	size="sm"
  	display={{ base: 'none', md: 'inline-flex' }}
  	as="a"
  	href="https://github.com/guria/modern-stack"
  	target="_blank"
  	rel="noopener noreferrer"
  	aria-label="View source on GitHub"
  >
  	<Github className={css({ w: '4', h: '4' })} />
  </IconButton>
  ```
- [ ] Add theme toggle `IconButton` (desktop only). Read `resolvedThemeAtom` for the icon; read `themePreferenceAtom` for cycling:
  ```tsx
  const preference = themePreferenceAtom()
  const resolved = resolvedThemeAtom()
  const cycleTheme = wrap(() => {
    const next = { system: 'light', light: 'dark', dark: 'system' } as const
    themePreferenceAtom.set(next[preference])
  })
  // ...
  <IconButton variant="plain" size="sm" display={{ base: 'none', md: 'inline-flex' }} onClick={cycleTheme} aria-label="Toggle theme">
    {preference === 'system' ? <Monitor ... /> : resolved === 'dark' ? <Moon ... /> : <Sun ... />}
  </IconButton>
  ```
- [ ] Run `npm run typecheck` — no errors

---

## Task 3: Wire SettingsPage to global themePreferenceAtom

**File:** `src/pages/settings/ui/SettingsPage.tsx`

The local `themeAtom` (line 24) is a dummy — not connected to anything. Replace it with the shared `themePreferenceAtom`.

**Steps:**

- [ ] In `SettingsPage.tsx`, remove `const themeAtom = atom('system', 'settings.theme')` (line 24)
- [ ] Remove `appearanceDirtyAtom` (line 26) — theme changes are instant, no "Save" needed
- [ ] Remove `appearanceDirty` variable usage in the render (line 78, 220–223)
- [ ] Import `themePreferenceAtom` from the shared model
- [ ] Update theme `Select.Root` to use `themePreferenceAtom` instead of the local atom:
  - `value={[themePreferenceAtom()]}` — read as `themePreference`
  - `onValueChange`: `themePreferenceAtom.set(val)` (no dirty state)
- [ ] Remove the "Appearance" `Section` `footer` prop (was showing Save button)
- [ ] Run `npm run typecheck` — no errors

---

## Task 4: Final verification

- [ ] Open `http://localhost:5100/dashboard` in desktop view — top bar shows search field (no "Dashboard" label), page content still shows `<h1>Dashboard</h1>`
- [ ] Open `http://localhost:5100/chat/1` in desktop view — top bar shows search field (no conversation header duplication), content still shows the Engineering conversation header
- [ ] Toggle theme button cycles Sun → Moon → Monitor → Sun, page switches light/dark/system visually
- [ ] Reload page — theme preference is restored from localStorage
- [ ] Open Settings → Appearance → Theme select shows current preference; changing it updates the page immediately without needing to click Save
- [ ] GitHub icon opens `https://github.com/guria/modern-stack` in new tab
- [ ] Resize to mobile (< md) — search and icon buttons are hidden; mobile header title is still visible
- [ ] Run `npm run typecheck` — clean
- [ ] Run `npm run test:run` — no regressions

---

## Out of Scope

- Actual search results / command palette functionality (search input is presentational)
- Removing page-level `<h1>` headings from content (they become the sole page title context and are needed)
- Mobile theme toggle (can be done via Settings page)
- Breadcrumbs or back buttons in the top bar
