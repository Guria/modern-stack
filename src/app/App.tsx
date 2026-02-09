import { reatomNumber } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { Counter } from '#counter/Counter.tsx'
import { styled } from '#styled-system/jsx'
import { container } from '#styled-system/patterns'

const counterAtom = reatomNumber(10, 'counter')

export const App = reatomComponent(function App() {
	return (
		<main className={container({ maxW: '4xl', p: '8' })}>
			<styled.h1 fontSize="4xl" fontWeight="bold" mb="6">
				Modern Stack
			</styled.h1>
			<Counter countAtom={counterAtom} />
		</main>
	)
})
