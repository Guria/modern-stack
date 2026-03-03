import { atom } from '@reatom/core'
import type { ComponentType } from 'react'

export type BreadcrumbDescriptor = {
	label: () => string
	href?: string
	isLoading?: () => boolean
	backLabel?: () => string
}

export const breadcrumbsAtom = atom<ReadonlyMap<number, BreadcrumbDescriptor>>(
	new Map<number, BreadcrumbDescriptor>(),
	'breadcrumbsAtom',
)

export const breadcrumbsOverrideAtom = atom<ComponentType | null>(null, 'breadcrumbsOverrideAtom')
export const mobileHeaderOverrideAtom = atom<ComponentType | null>(null, 'mobileHeaderOverrideAtom')

export function setBreadcrumb(level: number, descriptor: BreadcrumbDescriptor): () => void {
	breadcrumbsAtom.set((prev) => {
		const next = new Map(prev)
		next.set(level, descriptor)
		for (const key of next.keys()) {
			if (key > level) next.delete(key)
		}
		return next
	})
	return () => {
		breadcrumbsAtom.set((prev) => {
			if (prev.get(level) !== descriptor) return prev
			const next = new Map(prev)
			next.delete(level)
			for (const key of next.keys()) {
				if (key > level) next.delete(key)
			}
			return next
		})
	}
}

export function setBreadcrumbsOverride(Component: ComponentType): () => void {
	breadcrumbsOverrideAtom.set(() => Component)
	return () => {
		breadcrumbsOverrideAtom.set((current) => (current === Component ? null : current))
	}
}

export function setMobileHeaderOverride(Component: ComponentType): () => void {
	mobileHeaderOverrideAtom.set(() => Component)
	return () => {
		mobileHeaderOverrideAtom.set((current) => (current === Component ? null : current))
	}
}
