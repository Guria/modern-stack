import { atom, computed, withChangeHook, withLocalStorage } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { getLocale, isLocale, setLocale, baseLocale } from '#paraglide/runtime.js'

export const localeAtom = atom(getLocale(), 'locale').extend(
	withLocalStorage({
		key: 'locale',
		fromSnapshot: (value) => (isLocale(value) ? value : baseLocale),
	}),
	withChangeHook((locale) => void setLocale(locale, { reload: false })),
)

export const reatomM = <T>(fn: (messages: typeof m) => T, name: string) =>
	computed(() => {
		localeAtom()
		return fn(m)
	}, name)
