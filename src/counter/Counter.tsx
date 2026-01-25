import { reatomNumber, wrap } from '@reatom/core'
import { reatomFactoryComponent } from '@reatom/react'

import { Button } from '#shared/components/ui'
import { css } from '#styled-system/css'

export const Counter = reatomFactoryComponent<{ initial?: number }>(({ initial = 0 }, { name }) => {
	const countAtom = reatomNumber(initial, `${name}.count`)

	return () => (
		<div className={css({ display: 'flex', alignItems: 'center', gap: '4' })}>
			<Button onClick={wrap(() => countAtom.decrement())}>-</Button>
			<span
				data-testid="counter-value"
				className={css({
					fontSize: '2xl',
					fontWeight: 'semibold',
					minW: '12',
					textAlign: 'center',
				})}
			>
				{countAtom()}
			</span>
			<Button onClick={wrap(() => countAtom.increment())}>+</Button>
		</div>
	)
})
