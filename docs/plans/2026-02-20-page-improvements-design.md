# Page Improvements Design

**Date:** 2026-02-20
**Approach:** Impact-first — highest-value fixes before polish
**Scope:** All pages at http://localhost:5100/

---

## Pages Reviewed

| Page        | Route                              | Layout                       |
| ----------- | ---------------------------------- | ---------------------------- |
| Dashboard   | `/dashboard`                       | Full-page with cards + chart |
| Articles    | `/articles`, `/articles/:id`       | Master-detail                |
| Connections | `/connections`, `/connections/:id` | Master-detail                |
| Items       | `/items`                           | Full-page list (no detail)   |
| Chat        | `/chat`, `/chat/:id`               | Master-detail with input     |
| Timeline    | `/timeline`                        | Full-page vertical list      |
| Calculator  | `/calculator`                      | Centered widget              |
| Timer       | `/timer`                           | Centered widget              |
| Settings    | `/settings`                        | Full-page form               |
| Pricing     | `/pricing`                         | Full-page cards              |
| Usage       | `/usage`                           | Full-page with bars          |

---

## P0 — Broken / Critical

### 1. Items: No detail view

`/items/:id` currently redirects to the list — there is no detail panel. Items is the only master-detail page missing its detail half. Items are not clickable; there is no hover affordance.

**Fix:** Add a `detailRoute` for Items (`:itemId`) with a detail panel matching the Articles/Connections pattern. The list rows become clickable links. The detail panel shows item name, category badge, stock status badge, price, and a description field.

### 2. Chat: Messages don't anchor to bottom

On short threads, there is dead whitespace between the last message and the input bar. Messages should appear at the bottom of the scroll container, not the top.

**Fix:** Use `display: flex; flex-direction: column; justify-content: flex-end` on the message container, or scroll to bottom on mount/message update.

---

## P1 — Missing Core Interactions

### 3. Articles: No create/edit/delete

The detail pane is read-only prose. There is no way to create a new article or edit an existing one.

**Fix:**

- Add a "New article" button in the list header
- Add an "Edit" icon button in the detail pane header (inline with title/badge)
- Add a "Delete" action (destructive, with confirmation) in the detail header

### 4. Connections: No actions on detail

The detail pane is read-only. The Auth0 SSO entry shows an "Error" badge but offers no recovery path.

**Fix:**

- Add a "Test connection" button in the detail pane footer
- For Error-status connections, add a "Reconnect" primary button as an inline CTA in the detail pane
- Add an "Edit" action for connection configuration

### 5. Settings: Ambiguous save

No save button is visible. It is unclear whether changes auto-save or require explicit submission.

**Fix:** Add a "Save changes" button per section (Profile, Notifications, Appearance), shown only when a field in that section is dirty. This is preferable to a global save because the sections are independent.

### 6. Chat: No way to start a new conversation

The conversation list has no entry point for starting a new thread.

**Fix:** Add a "New conversation" icon button in the chat list header (consistent with the "New article" pattern).

---

## P2 — UX Polish

### 7. Empty states

"Select an article to view details." and "Select a connection to view details." are unstyled plain text centered in a large empty pane.

**Fix:** Replace with a styled empty state: a muted icon + heading + subtext. Example:

```
[icon: file-text]
No article selected
Choose an article from the list to view its details.
```

Use the same empty state component for both Articles and Connections detail panes.

### 8. Calculator & Timer layout

Both are small widgets floating in a large empty page. The surrounding whitespace is disproportionate and the pages feel unfinished.

**Fix:**

- Constrain both to a centered card with a sensible max-width (~400px for Calculator, ~360px for Timer)
- Vertically center the card in the content area
- Calculator: add a one-line "history" display above the main display showing the last completed expression (e.g. `8 × 9 = 72`)

### 9. Dashboard chart: No axis labels

The Weekly Traffic bar chart has no Y-axis, no value labels, and no tooltip on hover. The bar heights are unreadable without a scale.

**Fix:** Add Y-axis tick labels (left side) and a tooltip on bar hover showing the exact value and day name.

### 10. Usage page: No upgrade CTA

The page shows storage consumption with no path to upgrading. The "Upgrade to Pro" callout in the sidebar footer is the only entry point.

**Fix:** Add a "Manage plan" or "Upgrade storage" button near the storage bar header, linking to `/pricing`.

### 11. Timeline icon consistency

Event type icons use colored circles for some types (green for Deploy/Release, red for Incident) but plain gray circles for others (Comment, Branch, PR Merged).

**Fix:** Assign a distinct color per event type and apply it consistently. Suggested mapping:

- Deploy / Release → green
- PR Merged → blue
- Branch → purple
- Comment → gray
- Incident → red

---

## P3 — Feature Completeness (Stretch)

### 12. Timer: Custom duration input

Only 5 preset durations are available (10s, 1m, 5m, 10m, 25m). There is no way to enter an arbitrary duration.

**Fix:** Add a small text input (e.g. `MM:SS`) that updates the timer display when blurred/entered.

### 13. Pricing: Reflect actual current plan

"Pro" is highlighted as the featured/upgrade plan, but the user is on Free (10 GB storage limit matches the Free tier in the sidebar). The user's current plan should be visually indicated.

**Fix:** Mark the current plan card with a "Current plan" badge and disable its CTA button. The upgrade plan (Pro) can remain visually prominent.

---

## Implementation Order

```
P0-1  Items detail view (new route + panel + clickable list rows)
P0-2  Chat message anchoring
P1-3  Articles create/edit/delete
P1-4  Connections test/reconnect/edit actions
P1-5  Settings save buttons per section
P1-6  Chat new conversation button
P2-7  Empty state component (Articles + Connections)
P2-8  Calculator & Timer layout + calculator history row
P2-9  Dashboard chart Y-axis + tooltip
P2-10 Usage upgrade CTA
P2-11 Timeline icon color consistency
P3-12 Timer custom input
P3-13 Pricing current plan badge
```

---

## Out of Scope

- Wiring mock data to a real backend
- Authentication / authorization changes
- Mobile-specific breakpoint work (responsive sidebar already handled)
