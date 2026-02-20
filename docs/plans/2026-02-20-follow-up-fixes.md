# Follow-up Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Fix the chat layout overflow bug and replace the Items "← Back" link with a proper breadcrumb.

**Architecture:** Two independent, minimal changes. Chat fix is a single CSS value change in `MessageThread.tsx`. Breadcrumb replaces the hand-rolled back link in `ItemDetail.tsx` with the ParkUI `Breadcrumb.*` namespace already exported from `#shared/components`.

**Tech Stack:** React, Panda CSS (`styled`), ParkUI Breadcrumb (`Breadcrumb.*` from `#shared/components`).

---

## Context

**Completed in previous session (all committed, no rework needed):**
All 14 tasks from `docs/plans/2026-02-20-page-improvements.md` are done:

- Items detail route (`/items/:id`)
- Chat messages anchored to bottom, New Conversation button
- Styled empty states (Articles, Connections, Chat)
- Connection Test/Reconnect buttons in header with toast feedback
- Articles Edit + New buttons
- Settings per-section Save with dirty state
- Dashboard Y-axis labels
- Usage "Manage plan" CTA
- Calculator & Timer vertical centering
- Timer MM:SS custom input
- Pricing "Current plan" badge
- Toast infrastructure (`<Toaster />` in `App.tsx`, `toaster` from `#shared/components`)

**Two issues discovered but not yet fixed:**

1. **Chat layout overflow** — `MessageThread` uses `h="100dvh"` but is rendered below the AppShell sticky header (`h="14"` = 3.5rem). The component overflows 3.5rem below the viewport, pushing the input bar off-screen.

2. **Items detail "← Back" link** — currently a hand-rolled `<styled.a>` text link. The `Breadcrumb` component was installed (`mr park:add breadcrumb`) and is already exported from `#shared/components` as a namespace (`import { Breadcrumb } from '#shared/components'`).

---

## Key Project Patterns (for context)

- **No `useState`** — use `useAtom('')` from `@reatom/react` for local state.
- **No `useMemo`** — inline calls instead (project bans React hooks via `no-restricted-imports`).
- **Event handlers that call Reatom actions** must use `wrap()` at the top level: `const handler = wrap(() => { action() })`.
- **Icon-only buttons** use `IconButton`, not `Button`.
- **Color tokens**: semantic variants (`green.subtle.bg`) for badges, `gray.11` for muted text.
- **`Breadcrumb` namespace**: `import { Breadcrumb } from '#shared/components'` — exports `Root`, `List`, `Item`, `Link`, `Separator`, `Ellipsis`.
- **Reatom route paths**: call `someRoute.path()` (no args) for the bare path string, `someRoute.path({ param })` for parameterised.

---

## Task 1: Chat — fix MessageThread height overflow

The AppShell wraps page content in a flex column with a sticky header of `h="14"` (3.5rem). `MessageThread` hardcodes `h="100dvh"` which ignores this offset, causing the last 3.5rem (the input bar) to render below the visible viewport.

**File:**

- Modify: `src/pages/chat/ui/MessageThread.tsx:13`

**Step 1: Read the file**

```bash
# confirm line 13 is the outer div with h="100dvh"
```

**Step 2: Apply the fix**

Change **only** the `h` value on the outer `<styled.div>` (line 13):

```tsx
// Before:
<styled.div display="flex" flexDirection="column" h="100dvh">

// After:
<styled.div display="flex" flexDirection="column" h="calc(100dvh - 3.5rem)">
```

`3.5rem` = `h="14"` = 56px, which is the AppShell header height.

**Step 3: Verify**

Open `http://localhost:5100/chat/1`. The input bar should now be visible at the bottom of the viewport without scrolling. The message list should still scroll correctly for longer threads.

**Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

**Step 5: Commit**

```bash
git add src/pages/chat/ui/MessageThread.tsx
git commit -m "fix(chat): account for app header height in MessageThread viewport sizing"
```

---

## Task 2: Items detail — replace back link with Breadcrumb

The `ItemDetail` component has a hand-rolled `<styled.a>← Back to Items</styled.a>` navigation link. Replace it with the ParkUI `Breadcrumb` component (`Items / {item.name}`) which is already installed and exported.

**File:**

- Modify: `src/pages/items/ui/ItemDetail.tsx`

**Step 1: Read the file**

Confirm the current back link structure (lines 11-23).

**Step 2: Apply the change**

Replace the `<styled.a>` block and add the `Breadcrumb` import:

```tsx
// Add to imports (replace Badge import line):
import { Badge, Breadcrumb } from '#shared/components'

// Replace lines 11-23 (the styled.a back link) with:
;<Breadcrumb.Root mb="6">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/items">Items</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>{item.name}</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
```

No other changes to the file.

**Step 3: Verify**

Open `http://localhost:5100/items`, click any item row. The detail page should show a breadcrumb trail `Items › Widget Alpha` (or whatever item was clicked). Clicking "Items" in the breadcrumb should navigate back to the list.

**Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

**Step 5: Commit**

```bash
git add src/pages/items/ui/ItemDetail.tsx
git commit -m "feat(items): replace back link with Breadcrumb component"
```

---

## Out of Scope

- Breadcrumbs on other pages (Articles, Connections) — not requested.
- Fixing `MasterDetails` master panel `h="100dvh"` sticky overlap with AppShell header — not reported as a user-visible bug.
- Wiring mock data to a real backend.
