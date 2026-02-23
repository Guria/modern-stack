import { atom, computed, withChangeHook, withLocalStorage, withParams } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { getLocale, isLocale, setLocale, baseLocale, locales } from '#paraglide/runtime.js'

/**
 * Reactive atom holding the active locale, persisted to `localStorage`.
 *
 * - Initialized from the current runtime locale (`getLocale()`).
 * - `withParams` coerces unknown values to `baseLocale`, so calling `.set()`
 *   with an arbitrary string is safe.
 * - `withChangeHook` calls `setLocale` on every change with `{ reload: false }`
 *   to switch locale without a full page reload.
 *
 * @example
 * // Read current locale
 * const locale = localeAtom()
 *
 * // Switch locale
 * localeAtom.set('es')
 *
 * // Iterate configured locales
 * localeAtom.locales.map((l) => ...)
 */
export const localeAtom = atom(getLocale(), 'locale').extend(
	withParams((value: string | undefined) => (isLocale(value) ? value : baseLocale)),
	withLocalStorage({
		key: 'locale',
		fromSnapshot: (value) => (isLocale(value) ? value : baseLocale),
	}),
	withChangeHook((locale) => void setLocale(locale, { reload: false })),
	(target) => ({
		/** Readonly array of all configured locales (e.g. `["en", "es"]`). */
		locales,
		/**
		 * Creates a locale-aware computed value that re-evaluates whenever the
		 * locale changes. Use this for values derived from message functions that
		 * live outside of render (e.g. `createListCollection` for Ark UI selects).
		 *
		 * @param fn - Callback receiving the message namespace `m`. Return any
		 *   value derived from translated strings.
		 * @param name - Debug name passed to the underlying `computed`.
		 *
		 * @example
		 * const statusCollection = reatomLoc(
		 *   (m) => createListCollection({ items: [{ label: m.items_filter_all(), value: 'all' }], ... }),
		 *   'feature.statusCollection',
		 * )
		 */
		reatomLoc: <T>(fn: (messages: typeof m) => T, name: string) =>
			computed(() => {
				target()
				return fn(m)
			}, name),
	}),
)

/**
 * Shorthand for `localeAtom.reatomLoc`. Creates a locale-aware computed value
 * that re-evaluates whenever the active locale changes.
 *
 * @see {@link localeAtom.reatomLoc} for full documentation.
 */
export const reatomLoc = localeAtom.reatomLoc
