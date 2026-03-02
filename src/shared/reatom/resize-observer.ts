import { computed, memo, reatomObservable, type Atom } from '@reatom/core'

export const withResizeObserver = () => {
	return (target: Atom<HTMLElement | null>) => {
		const sizeEntry = computed(() => {
			const stateAtom = memo(() => {
				const node = target()
				if (!node) return null

				return reatomObservable<ResizeObserverEntry | undefined>((set) => {
					const observer = new ResizeObserver((entries) =>
						set(entries.find((entry) => entry.target === node)),
					)
					observer.observe(node)
					return () => observer.disconnect()
				})
			})

			return stateAtom?.()
		}, `${target.name}.result`)

		return { sizeEntry }
	}
}
