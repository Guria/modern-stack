import { wrap, type NumberAtom } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { Button } from '#shared/components/ui'
import { Flex, styled } from '#styled-system/jsx'

export const Counter = reatomComponent(
	({ countAtom }: { countAtom: NumberAtom }) => (
		<Flex data-testid={`counter@${countAtom.name}`}>
			<Button onClick={wrap(() => countAtom.decrement())}>-</Button>
			<styled.output
				data-testid="counter:value"
				fontSize="2xl"
				fontWeight="semibold"
				minW="12"
				textAlign="center"
			>
				{countAtom()}
			</styled.output>
			<Button onClick={wrap(() => countAtom.increment())}>+</Button>
		</Flex>
	),
	'Counter',
)
