import { context, noop, urlAtom, withChangeHook } from '@reatom/core'

const originalHref = window.location.href
export const setupStorybookUrl = (initialPath = '') => {
	const frame = context.start()
	frame.run(() => {
		// Configure urlAtom for Storybook: routing state works internally but
		// the iframe URL stays fixed so Storybook remains happy.
		urlAtom.sync.set(() => noop)
		urlAtom.extend(withChangeHook(() => void window.history.replaceState({}, '', originalHref)))
		// @ts-expect-error - Vite replaces this with the actual value at build time
		const base = import.meta.env.BASE_URL ?? ''
		urlAtom.go(base + initialPath)
	})

	return frame
}
