# Page Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix broken navigation, add missing interactions, and polish the UI across all 11 pages.

**Architecture:** Each task is self-contained. Items detail view follows the same master-detail pattern used by Articles and Connections (reatomRoute + MasterDetails widget). UI-only tasks (empty states, layout, buttons) touch only the relevant page components. Settings dirty state uses Reatom atoms, matching the existing calculator/timer atom pattern.

**Tech Stack:** React, Reatom (`atom`, `action`, `wrap`, `reatomComponent`, `reatomRoute`), Panda CSS (`styled`, `css`), ParkUI components (`Button`, `Badge`, `Card`), MSW mocks, Vitest + Storybook tests.

---

## Task 1: Items — add `fetchItemById` to entity API

The mock handler for `GET /items/:itemId` already exists in `src/entities/item/mocks/handlers.ts` but there is no API function for it.

**Files:**

- Modify: `src/entities/item/api/itemsApi.ts`
- Modify: `src/entities/item/index.ts`

**Step 1: Add `fetchItemById` to the API file**

```ts
// src/entities/item/api/itemsApi.ts
import type { Item } from '#entities/item/model/types'
import { apiClient } from '#shared/api'

export const ITEMS_API_PATH = '/items'

export async function fetchItems() {
	return apiClient.get<Item[]>(ITEMS_API_PATH)
}

export async function fetchItemById(itemId: string) {
	return apiClient.get<Item>(`${ITEMS_API_PATH}/${itemId}`)
}
```

**Step 2: Export from index**

```ts
// src/entities/item/index.ts
export { fetchItems, fetchItemById, ITEMS_API_PATH } from './api/itemsApi'
export type { Category, Item } from './model/types'
```

**Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/entities/item/api/itemsApi.ts src/entities/item/index.ts
git commit -m "feat(items): add fetchItemById API function"
```

---

## Task 2: Items — create detail UI components

Create the four detail-panel components that the new master-detail route will need, modelled after the identical files in `src/pages/articles/ui/`.

**Files:**

- Create: `src/pages/items/ui/ItemNoSelection.tsx`
- Create: `src/pages/items/ui/ItemNotFound.tsx`
- Create: `src/pages/items/ui/ItemDetailLoadingState.tsx`
- Create: `src/pages/items/ui/ItemDetail.tsx`

**Step 1: Create `ItemNoSelection`**

```tsx
// src/pages/items/ui/ItemNoSelection.tsx
import { Package } from 'lucide-react'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ItemNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			color="gray.11"
			p="8"
			textAlign="center"
		>
			<Package className={css({ w: '10', h: '10', color: 'gray.8' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No item selected
			</styled.p>
			<styled.p fontSize="xs">Choose an item from the list to view its details.</styled.p>
		</styled.div>
	)
}
```

**Step 2: Create `ItemNotFound`**

```tsx
// src/pages/items/ui/ItemNotFound.tsx
import { styled } from '#styled-system/jsx'

export function ItemNotFound({ itemId }: { itemId: string }) {
	return (
		<styled.div p="8" color="gray.11" fontSize="sm">
			Item "{itemId}" was not found.
		</styled.div>
	)
}
```

**Step 3: Create `ItemDetailLoadingState`**

```tsx
// src/pages/items/ui/ItemDetailLoadingState.tsx
import { Skeleton } from '#shared/components'
import { styled } from '#styled-system/jsx'

export function ItemDetailLoadingState() {
	return (
		<styled.div p="8" display="flex" flexDirection="column" gap="4">
			<Skeleton h="8" w="48" />
			<Skeleton h="4" w="24" />
			<Skeleton h="4" w="full" />
		</styled.div>
	)
}
```

**Step 4: Create `ItemDetail`**

```tsx
// src/pages/items/ui/ItemDetail.tsx
import type { Item } from '#entities/item'
import { Badge } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { CategoryBadge } from './components/CategoryBadge'

export function ItemDetail({ item }: { item: Item }) {
	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					{item.name}
				</styled.h1>
				<CategoryBadge category={item.category} />
				{!item.inStock && (
					<Badge
						size="sm"
						bg="red.subtle.bg"
						color="red.subtle.fg"
						borderWidth="1px"
						borderColor="red.6"
					>
						Out of Stock
					</Badge>
				)}
			</styled.div>

			<styled.div display="grid" gap="3">
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Price
					</styled.span>
					<styled.span fontSize="sm" fontWeight="semibold" fontVariantNumeric="tabular-nums">
						${item.price.toFixed(2)}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Category
					</styled.span>
					<styled.span fontSize="sm" textTransform="capitalize">
						{item.category}
					</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						Stock
					</styled.span>
					<styled.span fontSize="sm">{item.inStock ? 'In stock' : 'Out of stock'}</styled.span>
				</styled.div>
				<styled.div display="flex" gap="2">
					<styled.span fontSize="sm" color="gray.11" w="24">
						ID
					</styled.span>
					<styled.span fontSize="sm" color="gray.11" fontVariantNumeric="tabular-nums">
						{item.id}
					</styled.span>
				</styled.div>
			</styled.div>
		</styled.div>
	)
}
```

**Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

**Step 6: Commit**

```bash
git add src/pages/items/ui/ItemNoSelection.tsx src/pages/items/ui/ItemNotFound.tsx \
  src/pages/items/ui/ItemDetailLoadingState.tsx src/pages/items/ui/ItemDetail.tsx
git commit -m "feat(items): add item detail UI components"
```

---

## Task 3: Items — convert to master-detail layout

Refactor `itemsRoute` to use the master-detail pattern and add `itemDetailRoute`. The `ItemsPage` currently renders a full-page list; it needs to become the master panel.

**Files:**

- Modify: `src/pages/items/model/routes.tsx`
- Modify: `src/pages/items/ui/ItemsPage.tsx`
- Modify: `src/pages/items/index.ts`
- Modify: `src/app/routes.ts`

**Step 1: Update `ItemsPage` to accept master-detail props**

Add `selectedItemId`, `getItemHref`, and `detail` props. Wrap the list rows in `<styled.a>` links (like `ArticleListItem`) and switch the outer container to `MasterDetails`.

```tsx
// src/pages/items/ui/ItemsPage.tsx  (replace existing render return)
// Add to imports:
import type { ReactNode } from 'react'
import { MasterDetails } from '#widgets/layout'

// Update type:
type ItemsPageProps = {
	items: Item[]
	selectedItemId: string | undefined
	getItemHref: (itemId: string) => string
	detail: ReactNode
}

// Replace the return inside the reatomComponent:
export const ItemsPage = reatomComponent(
	({ items, selectedItemId, getItemHref, detail }: ItemsPageProps) => {
		// ... (keep all the existing filter/sort atoms and logic unchanged)

		return (
			<MasterDetails
				isDetailVisible={selectedItemId !== undefined}
				master={
					<styled.div>
						{/* move the existing h1 + filter bar + list here */}
						<styled.div p="6">
							<styled.h1 fontSize="2xl" fontWeight="bold" mb="6">
								Items
							</styled.h1>
							{/* ... existing filter controls ... */}
						</styled.div>
						<styled.div display="grid" gap="3" px="6" pb="6">
							{filtered.map((item) => (
								<styled.a
									key={item.id}
									href={getItemHref(item.id)}
									display="flex"
									alignItems="center"
									justifyContent="space-between"
									px="4"
									py="3"
									borderWidth="1px"
									borderColor="gray.4"
									borderRadius="lg"
									textDecoration="none"
									color="inherit"
									bg={selectedItemId === item.id ? 'gray.3' : 'transparent'}
									_hover={{ bg: 'gray.3' }}
								>
									<styled.div display="flex" alignItems="center" gap="3">
										<styled.span fontWeight="medium" fontSize="sm">
											{item.name}
										</styled.span>
										<CategoryBadge category={item.category} />
										{!item.inStock && (
											<Badge
												size="sm"
												bg="red.subtle.bg"
												color="red.subtle.fg"
												borderWidth="1px"
												borderColor="red.6"
											>
												Out of Stock
											</Badge>
										)}
									</styled.div>
									<styled.span
										fontWeight="semibold"
										fontSize="sm"
										fontVariantNumeric="tabular-nums"
									>
										${item.price.toFixed(2)}
									</styled.span>
								</styled.a>
							))}
							{filtered.length === 0 && (
								<styled.p color="gray.11" fontSize="sm" py="8" textAlign="center">
									No items match the current filters.
								</styled.p>
							)}
						</styled.div>
					</styled.div>
				}
				detail={detail}
			/>
		)
	},
)
```

**Step 2: Update `routes.tsx` to add `itemDetailRoute`**

```tsx
// src/pages/items/model/routes.tsx
import { retryComputed, wrap } from '@reatom/core'
import { fetchItems, fetchItemById } from '#entities/item'
import { getFirstOutletChild, rootRoute } from '#shared/router'

import { ItemDetail } from '../ui/ItemDetail'
import { ItemDetailLoadingState } from '../ui/ItemDetailLoadingState'
import { ItemNoSelection } from '../ui/ItemNoSelection'
import { ItemNotFound } from '../ui/ItemNotFound'
import { ItemsPage } from '../ui/ItemsPage'
import { ItemsPageError } from '../ui/ItemsPageError'
import { ItemsPageLoading } from '../ui/ItemsPageLoading'

export const itemsRoute = rootRoute.reatomRoute(
	{
		path: 'items',
		loader: fetchItems,
		render: (self) => {
			const selectedItemId = itemDetailRoute()?.itemId
			const loaderStatus = self.loader.status()
			const data = self.loader.data()
			if (loaderStatus.isFirstPending || (loaderStatus.isPending && data == null)) {
				return <ItemsPageLoading />
			}
			if (data == null) {
				return <ItemsPageError onRetry={wrap(() => retryComputed(self.loader))} />
			}
			return (
				<ItemsPage
					items={data}
					selectedItemId={selectedItemId}
					getItemHref={(itemId) => itemDetailRoute.path({ itemId })}
					detail={getFirstOutletChild(self, <ItemNoSelection />)}
				/>
			)
		},
	},
	'items',
)

export const itemDetailRoute = itemsRoute.reatomRoute(
	{
		path: ':itemId',
		loader: ({ itemId }) => fetchItemById(itemId),
		render: (self) => {
			if (self.loader.pending() > 0) return <ItemDetailLoadingState />
			const item = self.loader.data()
			return item ? <ItemDetail item={item} /> : <ItemNotFound itemId={self().itemId} />
		},
	},
	'itemDetail',
)
```

**Step 3: Update `items/index.ts`**

```ts
// src/pages/items/index.ts
export { itemsRoute, itemDetailRoute } from './model/routes'
export { ItemsNavItem } from './ui/ItemsNavItem'
```

**Step 4: Update `src/app/routes.ts`**

```ts
// src/app/routes.ts  — add itemDetailRoute to the export line:
export { itemsRoute, itemDetailRoute } from '#pages/items'
```

**Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

**Step 6: Verify in browser**

Navigate to `http://localhost:5100/items`, click an item row, confirm the detail panel opens on the right. Click back to list; panel closes.

**Step 7: Commit**

```bash
git add src/pages/items/ src/app/routes.ts
git commit -m "feat(items): convert to master-detail layout with item detail view"
```

---

## Task 4: Chat — anchor messages to bottom of thread

Short threads show dead whitespace between messages and the input bar because messages render at the top of the flex container. Fix: add a `mt="auto"` spacer before the message list so it pushes down when there's room.

**Files:**

- Modify: `src/pages/chat/ui/MessageThread.tsx:26`

**Step 1: Wrap message list in a spacer pattern**

Replace the existing messages container (line 26–59):

```tsx
// Before:
<styled.div flex="1" overflowY="auto" p="6" display="flex" flexDirection="column" gap="4">
  {conversation.messages.map(...)}
</styled.div>

// After:
<styled.div flex="1" overflowY="auto" p="6" display="flex" flexDirection="column">
  <styled.div mt="auto" display="flex" flexDirection="column" gap="4">
    {conversation.messages.map((message) => (
      // ... identical message JSX, unchanged ...
    ))}
  </styled.div>
</styled.div>
```

**Step 2: Verify in browser**

Open `http://localhost:5100/chat/1` — the Engineering thread has 5 messages and should now render flush against the input bar with no dead space above.

**Step 3: Commit**

```bash
git add src/pages/chat/ui/MessageThread.tsx
git commit -m "fix(chat): anchor messages to bottom of scroll container"
```

---

## Task 5: Empty states — style NoSelection components

`ArticleNoSelection`, `ConnectionNoSelection`, and `MessageThreadNoSelection` are all plain unstyled text. Replace them with a consistent styled empty state (icon + heading + subtext).

**Files:**

- Modify: `src/pages/articles/ui/ArticleNoSelection.tsx`
- Modify: `src/pages/connections/ui/ConnectionNoSelection.tsx`
- Modify: `src/pages/chat/ui/MessageThreadNoSelection.tsx`

**Step 1: Update `ArticleNoSelection`**

```tsx
// src/pages/articles/ui/ArticleNoSelection.tsx
import { FileText } from 'lucide-react'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ArticleNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			p="8"
			textAlign="center"
			color="gray.11"
		>
			<FileText className={css({ w: '10', h: '10', color: 'gray.8' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No article selected
			</styled.p>
			<styled.p fontSize="xs">Choose an article from the list to view its content.</styled.p>
		</styled.div>
	)
}
```

**Step 2: Update `ConnectionNoSelection`**

```tsx
// src/pages/connections/ui/ConnectionNoSelection.tsx
import { Link2 } from 'lucide-react'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function ConnectionNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			p="8"
			textAlign="center"
			color="gray.11"
		>
			<Link2 className={css({ w: '10', h: '10', color: 'gray.8' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No connection selected
			</styled.p>
			<styled.p fontSize="xs">Choose a connection from the list to view its details.</styled.p>
		</styled.div>
	)
}
```

**Step 3: Update `MessageThreadNoSelection`**

```tsx
// src/pages/chat/ui/MessageThreadNoSelection.tsx
import { MessageSquare } from 'lucide-react'
import { css } from '#styled-system/css'
import { styled } from '#styled-system/jsx'

export function MessageThreadNoSelection() {
	return (
		<styled.div
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			h="100%"
			gap="3"
			p="8"
			textAlign="center"
			color="gray.11"
		>
			<MessageSquare className={css({ w: '10', h: '10', color: 'gray.8' })} />
			<styled.p fontWeight="medium" fontSize="sm">
				No conversation selected
			</styled.p>
			<styled.p fontSize="xs">Choose a conversation from the list to start reading.</styled.p>
		</styled.div>
	)
}
```

**Step 4: Typecheck**

```bash
npm run typecheck
```

**Step 5: Commit**

```bash
git add src/pages/articles/ui/ArticleNoSelection.tsx \
  src/pages/connections/ui/ConnectionNoSelection.tsx \
  src/pages/chat/ui/MessageThreadNoSelection.tsx
git commit -m "feat: replace plain-text empty states with styled no-selection components"
```

---

## Task 6: Connections — add Test/Reconnect actions to detail view

The detail pane is read-only. Add a "Test connection" button. For connections with `status === 'error'`, also show a "Reconnect" primary button.

**Files:**

- Modify: `src/pages/connections/ui/ConnectionDetail.tsx`

**Step 1: Update `ConnectionDetail`**

```tsx
// src/pages/connections/ui/ConnectionDetail.tsx
import type { Connection } from '#entities/connection'
import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { ConnectionStatusBadge } from './components/ConnectionStatusBadge'
import { ConnectionTypeBadge } from './components/ConnectionTypeBadge'

export function ConnectionDetail({ connection }: { connection: Connection }) {
	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6">
				<styled.h1 fontSize="2xl" fontWeight="bold">
					{connection.name}
				</styled.h1>
				<ConnectionTypeBadge type={connection.type} />
				<ConnectionStatusBadge status={connection.status} />
			</styled.div>
			<styled.p color="gray.11" fontSize="sm" lineHeight="relaxed">
				{connection.description}
			</styled.p>
			<styled.div display="grid" gap="4" mt="6">
				{connection.details.map((paragraph, index) => (
					<styled.p key={index} color="gray.11" fontSize="sm" lineHeight="relaxed">
						{paragraph}
					</styled.p>
				))}
			</styled.div>
			<styled.div display="flex" gap="2" mt="8">
				{connection.status === 'error' && <Button size="sm">Reconnect</Button>}
				<Button size="sm" variant="outline">
					Test connection
				</Button>
			</styled.div>
		</styled.div>
	)
}
```

**Step 2: Verify in browser**

Open `http://localhost:5100/connections/4` (Auth0 SSO — Error status). Both "Reconnect" and "Test connection" buttons should appear. Open connection 1 (Stripe — Active); only "Test connection" appears.

**Step 3: Typecheck**

```bash
npm run typecheck
```

**Step 4: Commit**

```bash
git add src/pages/connections/ui/ConnectionDetail.tsx
git commit -m "feat(connections): add Test and Reconnect action buttons to detail view"
```

---

## Task 7: Articles — add Edit action and New button

Add read-only Edit button on detail pane header and a New Article button on the list header (UI only — no mutation wired up).

**Files:**

- Modify: `src/pages/articles/ui/ArticleDetail.tsx`
- Modify: `src/pages/articles/ui/components/ArticleList.tsx`

**Step 1: Add Edit button to `ArticleDetail`**

```tsx
// src/pages/articles/ui/ArticleDetail.tsx
import type { Article } from '#entities/article'
import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { ArticleStatusBadge } from './components/ArticleStatusBadge'

export function ArticleDetail({ article }: { article: Article }) {
	return (
		<styled.div p="8">
			<styled.div display="flex" alignItems="center" gap="3" mb="6" flexWrap="wrap">
				<styled.h1 fontSize="2xl" fontWeight="bold" flex="1">
					{article.title}
				</styled.h1>
				<ArticleStatusBadge status={article.status} />
				<Button size="sm" variant="outline">
					Edit
				</Button>
			</styled.div>
			<styled.p color="gray.11" fontSize="sm" lineHeight="relaxed">
				{article.description}
			</styled.p>
			<styled.div display="grid" gap="4" mt="6">
				{article.content.map((paragraph, index) => (
					<styled.p key={index} color="gray.11" fontSize="sm" lineHeight="relaxed">
						{paragraph}
					</styled.p>
				))}
			</styled.div>
		</styled.div>
	)
}
```

**Step 2: Add New Article button to `ArticleList`**

```tsx
// src/pages/articles/ui/components/ArticleList.tsx
import type { Article } from '#entities/article'
import { Button } from '#shared/components'
import { styled } from '#styled-system/jsx'
import { ArticleListItem } from './ArticleListItem'

type ArticleListProps = {
	articles: Article[]
	selectedId: string | undefined
	getArticleHref: (articleId: string) => string
}

export function ArticleList({ articles, selectedId, getArticleHref }: ArticleListProps) {
	return (
		<>
			<styled.div
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				px="4"
				py="3"
				borderBottomWidth="1px"
				borderColor="gray.4"
			>
				<styled.h3 fontSize="sm" fontWeight="semibold" color="gray.11">
					Articles
				</styled.h3>
				<Button size="xs" variant="ghost">
					+ New
				</Button>
			</styled.div>
			{articles.map((article) => (
				<ArticleListItem
					key={article.id}
					article={article}
					href={getArticleHref(article.id)}
					isSelected={selectedId === article.id}
				/>
			))}
		</>
	)
}
```

**Step 3: Typecheck**

```bash
npm run typecheck
```

**Step 4: Commit**

```bash
git add src/pages/articles/ui/ArticleDetail.tsx \
  src/pages/articles/ui/components/ArticleList.tsx
git commit -m "feat(articles): add Edit button on detail and New Article button on list"
```

---

## Task 8: Chat — add New Conversation button

Add a compose/new-conversation icon button in the chat list header, beside the search box.

**Files:**

- Modify: `src/pages/chat/ui/components/ConversationList.tsx`

**Step 1: Update `ConversationList`**

```tsx
// src/pages/chat/ui/components/ConversationList.tsx — replace the header div
import { SquarePen } from 'lucide-react'
import { Button } from '#shared/components'
import { css } from '#styled-system/css'

// Replace the top `<styled.div p="4" borderBottomWidth...>` with:
;<styled.div
	p="3"
	borderBottomWidth="1px"
	borderColor="gray.4"
	display="flex"
	gap="2"
	alignItems="center"
>
	<Input placeholder="Search conversations..." size="sm" flex="1" />
	<Button size="sm" variant="ghost" aria-label="New conversation">
		<SquarePen className={css({ w: '4', h: '4' })} />
	</Button>
</styled.div>
```

**Step 2: Typecheck**

```bash
npm run typecheck
```

**Step 3: Commit**

```bash
git add src/pages/chat/ui/components/ConversationList.tsx
git commit -m "feat(chat): add new conversation button in list header"
```

---

## Task 9: Settings — add Save buttons with dirty state

The settings form uses `defaultValue` on all inputs (uncontrolled). Convert each section to controlled state with Reatom atoms, track dirty state per section, and show a "Save changes" button when dirty.

**Files:**

- Modify: `src/pages/settings/ui/SettingsPage.tsx`
- Modify: `src/pages/settings/ui/components/Section.tsx`

**Step 1: Update `Section` to accept an optional `footer` slot**

```tsx
// src/pages/settings/ui/components/Section.tsx
import type { ReactNode } from 'react'
import { styled } from '#styled-system/jsx'

type SectionProps = {
	title: string
	children: ReactNode
	footer?: ReactNode
}

export function Section({ title, children, footer }: SectionProps) {
	return (
		<styled.section mb="8">
			<styled.h2
				fontSize="lg"
				fontWeight="semibold"
				mb="4"
				pb="2"
				borderBottomWidth="1px"
				borderColor="gray.4"
			>
				{title}
			</styled.h2>
			<styled.div display="grid" gap="4">
				{children}
			</styled.div>
			{footer && <styled.div mt="4">{footer}</styled.div>}
		</styled.section>
	)
}
```

**Step 2: Update `SettingsPage` with Reatom atoms and save buttons**

Add dirty-tracking atoms for Profile, Notifications, and Appearance. Each section gets a controlled value atom and a dirty atom. The Save button appears when dirty.

```tsx
// src/pages/settings/ui/SettingsPage.tsx
// Add to imports:
import { atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { Button } from '#shared/components'

// Add profile atoms (above the component, at module scope):
const displayNameAtom = atom('Alex Johnson', 'settings.displayName')
const emailAtom = atom('alex@example.com', 'settings.email')
const profileDirtyAtom = atom(false, 'settings.profileDirty')

// Notifications atoms:
const emailNotifAtom = atom('important', 'settings.emailNotif')
const desktopNotifAtom = atom('enabled', 'settings.desktopNotif')
const notifDirtyAtom = atom(false, 'settings.notifDirty')

// Appearance atoms:
const themeAtom = atom('system', 'settings.theme')
const densityAtom = atom('comfortable', 'settings.density')
const appearanceDirtyAtom = atom(false, 'settings.appearanceDirty')

// Convert SettingsPage from a plain function to reatomComponent:
export const SettingsPage = reatomComponent(() => {
	const displayName = displayNameAtom()
	const email = emailAtom()
	const profileDirty = profileDirtyAtom()
	const emailNotif = emailNotifAtom()
	const desktopNotif = desktopNotifAtom()
	const notifDirty = notifDirtyAtom()
	const theme = themeAtom()
	const density = densityAtom()
	const appearanceDirty = appearanceDirtyAtom()

	return (
		<styled.div p="8" maxW="800px">
			<styled.h1 fontSize="2xl" fontWeight="bold" mb="8">
				Settings
			</styled.h1>

			<Section
				title="Profile"
				footer={
					profileDirty ? (
						<Button size="sm" onClick={wrap(() => profileDirtyAtom.set(false))}>
							Save changes
						</Button>
					) : null
				}
			>
				<FieldRow label="Display name" description="Your name as shown to other users.">
					<Input
						value={displayName}
						size="sm"
						onChange={wrap((e: React.ChangeEvent<HTMLInputElement>) => {
							displayNameAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label="Email" description="Used for notifications and account recovery.">
					<Input
						value={email}
						size="sm"
						onChange={wrap((e: React.ChangeEvent<HTMLInputElement>) => {
							emailAtom.set(e.target.value)
							profileDirtyAtom.set(true)
						})}
					/>
				</FieldRow>
				<FieldRow label="Role">
					<styled.span fontSize="sm" color="gray.11">
						Admin
					</styled.span>
				</FieldRow>
			</Section>

			{/* Notifications and Appearance sections follow same pattern:
          each Select uses value={...} and onValueChange sets the atom
          and marks the section dirty; Save button in footer */}
		</styled.div>
	)
}, 'SettingsPage')
```

**Step 3: Typecheck**

```bash
npm run typecheck
```

**Step 4: Verify in browser**

Open Settings, type in Display name field — "Save changes" button appears. Click it — button disappears.

**Step 5: Commit**

```bash
git add src/pages/settings/ui/SettingsPage.tsx \
  src/pages/settings/ui/components/Section.tsx
git commit -m "feat(settings): add per-section Save buttons with dirty state tracking"
```

---

## Task 10: Dashboard — add Y-axis tick labels to BarChart

The bar chart has no scale. Add Y-axis labels (0, mid, max) to the left side.

**Files:**

- Modify: `src/pages/dashboard/ui/components/BarChart.tsx`

**Step 1: Update `BarChart`**

```tsx
// src/pages/dashboard/ui/components/BarChart.tsx
import type { ChartPoint } from '#entities/dashboard'
import { Card } from '#shared/components'
import { styled } from '#styled-system/jsx'

export function BarChart({ chartData }: { chartData: ChartPoint[] }) {
	const maxChartValue = Math.max(1, ...chartData.map((point) => point.value))
	const midValue = Math.round(maxChartValue / 2)

	return (
		<Card.Root p="5" borderWidth="1px" borderColor="gray.4" borderRadius="xl" bg="gray.1">
			<styled.div fontSize="sm" fontWeight="semibold" mb="4">
				Weekly Traffic
			</styled.div>
			<styled.div display="flex" gap="2">
				{/* Y-axis labels */}
				<styled.div
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
					h="140px"
					pb="5"
					flexShrink={0}
				>
					<styled.span fontSize="2xs" color="gray.11" textAlign="right">
						{maxChartValue.toLocaleString()}
					</styled.span>
					<styled.span fontSize="2xs" color="gray.11" textAlign="right">
						{midValue.toLocaleString()}
					</styled.span>
					<styled.span fontSize="2xs" color="gray.11" textAlign="right">
						0
					</styled.span>
				</styled.div>

				{/* Bars */}
				<styled.div display="flex" alignItems="flex-end" gap="2" h="140px" flex="1">
					{chartData.map((point) => (
						<styled.div
							key={point.label}
							flex="1"
							display="flex"
							flexDirection="column"
							alignItems="center"
							gap="1"
							h="100%"
							justifyContent="flex-end"
						>
							<styled.div
								w="100%"
								bg="colorPalette.9"
								borderRadius="sm"
								style={{ height: `${(point.value / maxChartValue) * 100}%` }}
								transition="height 0.3s"
								title={`${point.label}: ${point.value.toLocaleString()}`}
							/>
							<styled.span fontSize="xs" color="gray.11">
								{point.label}
							</styled.span>
						</styled.div>
					))}
				</styled.div>
			</styled.div>
		</Card.Root>
	)
}
```

**Step 2: Typecheck**

```bash
npm run typecheck
```

**Step 3: Commit**

```bash
git add src/pages/dashboard/ui/components/BarChart.tsx
git commit -m "feat(dashboard): add Y-axis tick labels to weekly traffic chart"
```

---

## Task 11: Usage — add Upgrade CTA

The page has no link to the Pricing page. Add a "Manage plan" button near the storage header.

**Files:**

- Modify: `src/pages/usage/ui/UsagePage.tsx`

**Step 1: Update `UsagePage`**

Import `Button` and add an anchor link beside the "Storage" heading:

```tsx
// In the storage header div, add the button:
<styled.div display="flex" alignItems="center" justifyContent="space-between" mb="2">
	<styled.span fontWeight="medium">Storage</styled.span>
	<styled.div display="flex" alignItems="center" gap="3">
		<styled.span fontSize="sm" color="gray.11">
			{usedGB} GB of {totalGB} GB used
		</styled.span>
		<Button size="xs" variant="outline" asChild>
			<styled.a href="/pricing">Manage plan</styled.a>
		</Button>
	</styled.div>
</styled.div>
```

**Step 2: Typecheck**

```bash
npm run typecheck
```

**Step 3: Commit**

```bash
git add src/pages/usage/ui/UsagePage.tsx
git commit -m "feat(usage): add Manage plan CTA linking to pricing page"
```

---

## Task 12: Calculator & Timer — improve layout centering

Both pages have a small widget floating in a large empty page without vertical centering. Fix: make the outer wrapper fill the viewport height and center the content.

**Files:**

- Modify: `src/pages/calculator/ui/CalculatorPage.tsx:142`
- Modify: `src/pages/timer/ui/TimerPage.tsx:30`

**Step 1: Update Calculator outer wrapper**

```tsx
// CalculatorPage.tsx — change line 142:
// Before:
<styled.div p="8" display="flex" justifyContent="center">
// After:
<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
```

**Step 2: Update Timer outer wrapper**

```tsx
// TimerPage.tsx — change line 30:
// Before:
<styled.div p="8" display="flex" justifyContent="center">
// After:
<styled.div p="8" display="flex" justifyContent="center" alignItems="center" minH="100dvh">
```

**Step 3: Typecheck**

```bash
npm run typecheck
```

**Step 4: Commit**

```bash
git add src/pages/calculator/ui/CalculatorPage.tsx src/pages/timer/ui/TimerPage.tsx
git commit -m "fix(calculator,timer): vertically center widget in viewport"
```

---

## Task 13: Timer — add custom duration input

Allow typing a custom `MM:SS` duration in addition to the preset buttons.

**Files:**

- Modify: `src/pages/timer/model/atoms.ts`
- Modify: `src/pages/timer/ui/TimerPage.tsx`

**Step 1: Read `atoms.ts` to understand the setDuration action, then add a `parseCustomTime` helper**

First read `src/pages/timer/model/atoms.ts` to confirm the signature of `setDuration`. Then add to `TimerPage.tsx`:

```tsx
// Add near the top of TimerPage.tsx after imports:
import { useState } from 'react'
import { Input } from '#shared/components'

// Inside the reatomComponent body, before the return:
const [customInput, setCustomInput] = useState('')

const handleCustomTimeCommit = wrap(() => {
  const parts = customInput.split(':')
  const minutes = parseInt(parts[0] ?? '0', 10)
  const seconds = parseInt(parts[1] ?? '0', 10)
  if (!isNaN(minutes) && !isNaN(seconds)) {
    setDuration(minutes * 60 + seconds)
  }
  setCustomInput('')
})

// Add this input below the presets div and above the Start/Reset div:
<Input
  placeholder="MM:SS"
  size="sm"
  w="20"
  value={customInput}
  disabled={running}
  onChange={(e) => setCustomInput(e.target.value)}
  onKeyDown={(e) => { if (e.key === 'Enter') handleCustomTimeCommit() }}
  onBlur={handleCustomTimeCommit}
/>
```

**Step 2: Typecheck**

```bash
npm run typecheck
```

**Step 3: Verify in browser**

Type `3:30` into the input and press Enter — timer display should change to `03:30`.

**Step 4: Commit**

```bash
git add src/pages/timer/ui/TimerPage.tsx
git commit -m "feat(timer): add custom MM:SS duration input"
```

---

## Task 14: Pricing — mark current plan

The Pro plan is highlighted as if it is the upgrade target, but the user is on Free (sidebar shows 10 GB limit matching Free tier). Add a "Current plan" badge and disable the CTA for the Free card.

**Files:**

- Modify: `src/pages/pricing/ui/PricingPage.tsx`

**Step 1: Read `PricingPage.tsx` first to understand current structure, then add `currentPlan` prop or hardcode**

The current plan is static mock data. Hardcode `currentPlan = 'free'` for now. Mark the Free card with a badge overlay and disable its button.

```tsx
// In the pricing cards, for the Free card:
// 1. Add a "Current plan" badge at the top-right of the card
// 2. Change button label to "Current plan" and set disabled={true}

// For the Pro card: keep highlighted but label the button "Upgrade to Pro"
// For the Team card: label "Get Team", not highlighted
```

Read `PricingPage.tsx` first to see the card structure before making exact edits.

**Step 2: Typecheck**

```bash
npm run typecheck
```

**Step 3: Commit**

```bash
git add src/pages/pricing/ui/PricingPage.tsx
git commit -m "fix(pricing): mark Free as current plan and disable its CTA"
```

---

## Verification

After all tasks:

```bash
npm run typecheck
npm run test:run
```

Expected: typecheck clean, test suite passes.

Visit each improved page in the browser to confirm the visual changes.

---

## Notes

- **Timeline icons** — already implemented correctly with per-kind colors in `TimelineEventCard.tsx`. No change needed.
- **Articles delete** — omitted intentionally. The mock data has no mutation support and a delete action without feedback would be confusing. Can be added later when a mutation layer exists.
- All changes are UI-only; no backend mutations are wired up.
