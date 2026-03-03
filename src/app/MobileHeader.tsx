import { reatomComponent } from '@reatom/react'

import { Skeleton } from '#shared/components'
import { breadcrumbsAtom, mobileHeaderOverrideAtom } from '#shared/model'
import {
	BackButton,
	MobileHeader as MobileHeaderLayout,
	MobileHeaderTitle,
} from '#widgets/mobile-header'

export const MobileHeader = reatomComponent(() => {
	const Override = mobileHeaderOverrideAtom()
	if (Override) return <Override />

	const descriptors = breadcrumbsAtom()
	const entries = [...descriptors.entries()].sort(([a], [b]) => a - b)
	const lastEntry = entries.at(-1)
	const parentEntry = entries.length > 1 ? entries.at(-2) : undefined

	if (parentEntry) {
		const [, parent] = parentEntry
		const [, current] = lastEntry!
		const isLoading = current.isLoading?.()
		return (
			<MobileHeaderLayout
				button={
					parent.href ? (
						<BackButton href={parent.href} label={parent.backLabel?.() ?? parent.label()} />
					) : undefined
				}
			>
				{isLoading ? (
					<Skeleton h="5" w="28" borderRadius="sm" />
				) : (
					<MobileHeaderTitle label={current.label()} />
				)}
			</MobileHeaderLayout>
		)
	}

	const label = lastEntry?.[1]?.label()
	return (
		<MobileHeaderLayout>{label ? <MobileHeaderTitle label={label} /> : null}</MobileHeaderLayout>
	)
}, 'MobileHeader')
