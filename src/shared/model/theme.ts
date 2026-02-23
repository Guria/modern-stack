import { computed, reatomEnum, reatomMediaQuery, withLocalStorage } from '@reatom/core'

import { withCoerce } from '#shared/reatom'

const isDarkModeMedia = reatomMediaQuery('(prefers-color-scheme: dark)')

export const themePreferenceAtom = reatomEnum(
	['system', 'light', 'dark'],
	'themePreference',
).extend(
	withCoerce('system'),
	(target) => target.extend(withLocalStorage({ key: 'theme', fromSnapshot: target.coerce })),
	(target) => ({
		resolved: computed(() => {
			const pref = target()
			if (pref === 'system') return isDarkModeMedia() ? 'dark' : 'light'
			return pref
		}, 'resolved'),
	}),
)
