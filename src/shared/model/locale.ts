import { atom, computed, withChangeHook, withLocalStorage } from '@reatom/core'

import { m } from '#paraglide/messages.js'
import { getLocale, setLocale } from '#paraglide/runtime.js'

export const localeAtom = atom(getLocale(), 'locale').extend(
	withLocalStorage('locale'),
	withChangeHook((locale) => void setLocale(locale, { reload: false })),
)

export const reatomT = <T>(fn: (messages: typeof m) => T, name: string) =>
	computed(() => {
		localeAtom()
		return fn(m)
	}, name)
