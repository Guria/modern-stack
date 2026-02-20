import { computed, reatomEnum, reatomMediaQuery, withLocalStorage } from '@reatom/core'

const isDarkModeMedia = reatomMediaQuery('(prefers-color-scheme: dark)')

export const themePreferenceAtom = reatomEnum(
	['system', 'light', 'dark'] as const,
	'themePreference',
).extend(withLocalStorage('theme'))

export const resolvedThemeAtom = computed(() => {
	const pref = themePreferenceAtom()
	if (pref === 'system') return isDarkModeMedia() ? 'dark' : 'light'
	return pref
}, 'resolvedTheme')
