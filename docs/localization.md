# Localization

This project uses **ParaglideJS** for compile-time i18n, wired into the Reatom state layer for reactive locale switching without page reloads.

## Stack

| Piece                                   | Role                                                                 |
| --------------------------------------- | -------------------------------------------------------------------- |
| `messages/<lang>.json`                  | Source of truth for all UI strings                                   |
| `src/paraglide/`                        | Generated output — do not edit manually                              |
| `localeAtom` in `#shared/model`         | Reactive atom holding the active locale, persisted to `localStorage` |
| `localeAtom.locales`                    | Readonly array of all configured locales (`["en", "es"]`)            |
| `reatomLoc` in `#shared/model`          | Factory for locale-aware computed values                             |
| `isLocale` from `#paraglide/runtime.js` | Runtime type guard for locale strings                                |

## Adding message keys

Add to all `messages/<lang>.json` files at the same time. Keys use snake_case grouped by context:

```json
// en.json
"items_filter_all": "All",
"items_category_electronics": "Electronics"

// es.json
"items_filter_all": "Todos",
"items_category_electronics": "Electrónica"
```

**Naming conventions:**

- `nav_*` — sidebar/nav labels
- `settings_*` — settings page
- `topbar_*` — top bar UI (buttons, aria-labels)
- `<entity>_*` — entity-scoped labels (e.g. `items_*`, `connection_*`)
- `language_<locale>` — locale display names (e.g. `language_en`, `language_es`)

**Description strings** end with a period to match the rest.

## Using messages in components

Import the message namespace and call functions:

```tsx
import { m } from '#paraglide/messages.js'

// In JSX — plain call, re-evaluated on every render
;<h1>{m.settings_title()}</h1>
```

`m.*()` functions return the string for the currently active locale. Because `App.tsx` reads `localeAtom()` (subscribing to locale changes), the entire tree re-renders on locale switch, so direct `m.*()` calls in JSX stay correct.

## Locale-aware computed values: `reatomLoc`

Use `reatomLoc` for **values computed outside of render** that need to update when the locale changes. The primary use case is `createListCollection` calls passed to Ark UI `Select.Root` — Ark caches the collection object internally, so it must be a new reference when locale changes.

```ts
import { reatomLoc } from '#shared/model'
import { createListCollection } from '@ark-ui/react/select'
import { m } from '#paraglide/messages.js'

const statusCollection = reatomLoc(
	(m) =>
		createListCollection({
			items: [
				{ label: m.items_filter_all(), value: 'all' },
				{ label: m.items_stock_in_stock(), value: 'in-stock' },
				{ label: m.items_stock_out_of_stock(), value: 'out-of-stock' },
			],
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	'myFeature.statusCollection',
)
```

`reatomLoc` is a thin wrapper around Reatom's `computed` — it subscribes to `localeAtom` and passes the message namespace `m` to the callback. The collection is only recreated when the locale actually changes, not on every render.

**In JSX, call it inline — no need for an intermediate variable:**

```tsx
<Select.Root collection={statusCollection()} ...>
  {statusCollection().items.map((item) => (
    <Select.Item key={item.value} item={item}>
      <Select.ItemText>{item.label}</Select.ItemText>
    </Select.Item>
  ))}
</Select.Root>
```

Reatom's `computed` is memoized, so calling `statusCollection()` multiple times in the same render is safe and efficient.

## Locale switching

### `localeAtom`

```ts
import { localeAtom } from '#shared/model'

// Read current locale
const locale = localeAtom()

// Set locale — withChangeHook calls setLocale automatically
localeAtom.set('es')
```

The atom is initialized from `getLocale()`, persisted via `withLocalStorage('locale')`, and uses `withChangeHook` to call `setLocale(locale, { reload: false })` on every change. The `{ reload: false }` option is what enables locale switching without a full page reload.

### Runtime guard

`localeAtom` uses `withParams` internally, so unknown values are silently coerced to `baseLocale`. You only need `isLocale` when branching on validity before setting:

```ts
import { isLocale } from '#paraglide/runtime.js'

// Only needed if you want to branch on validity:
if (isLocale(val)) localeAtom.set(val)

// Otherwise, just set directly — invalid values fall back to baseLocale:
localeAtom.set(val)
```

### Dynamic locale menu

Use `localeAtom.locales` instead of importing from the runtime. This means adding a new locale to `project.inlang/settings.json` automatically adds it to the UI:

```tsx
{
	localeAtom.locales.map((locale) => (
		<Menu.RadioItem key={locale} value={locale}>
			<Menu.ItemText>{m[`language_${locale}`]()}</Menu.ItemText>
			<Menu.ItemIndicator />
		</Menu.RadioItem>
	))
}
```

For each locale `xx` add a `language_xx` message key to both message files.

## What NOT to do

**Static module-level collections** — labels are captured at module init and never update:

```ts
// WRONG — stale labels after locale change
const sortCollection = createListCollection({
  items: [{ label: m.items_sort_name(), value: 'name' }],
  ...
})
```

**`useMemo`** — banned in this codebase (`no-restricted-imports`). Use `reatomLoc` instead.

**`localeAtom.subscribe` in `main.tsx`** — do not move the `setLocale` wiring out of `locale.ts`. The `withChangeHook` on `localeAtom` is the correct and only place for it.
