import { atom, withChangeHook, withLocalStorage } from '@reatom/core'

import { setLocale, getLocale } from '#paraglide/runtime.js'

export const localeAtom = atom(getLocale(), 'locale').extend(
	withLocalStorage('locale'),
	withChangeHook((value) => void setLocale(value, { reload: false })),
)
