import { reatomNumber, wrap } from '@reatom/core'
import { reatomFactoryComponent } from '@reatom/react'

import { css } from '#styled-system/css'

export const Counter = reatomFactoryComponent<{ initial?: number }>(({ initial = 0 }, { name }) => {
	const countAtom = reatomNumber(initial, `${name}.count`)

	return () => (
		<div className={css({ display: 'flex', alignItems: 'center', gap: '4' })}>
			<button
				className={css({
					px: '4',
					py: '2',
					bg: 'gray.200',
					rounded: 'md',
					cursor: 'pointer',
					_hover: { bg: 'gray.300' },
				})}
				onClick={wrap(() => countAtom.decrement())}
			>
				-
			</button>
			<span
				className={css({
					fontSize: '2xl',
					fontWeight: 'semibold',
					minW: '12',
					textAlign: 'center',
				})}
			>
				{countAtom()}
			</span>
			<button
				className={css({
					px: '4',
					py: '2',
					bg: 'gray.200',
					rounded: 'md',
					cursor: 'pointer',
					_hover: { bg: 'gray.300' },
				})}
				onClick={wrap(() => countAtom.increment())}
			>
				+
			</button>
		</div>
	)
})
