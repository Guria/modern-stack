import { assert } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { Fragment } from 'react'

import { Counter } from '#counter/Counter.tsx'
import { styled } from '#styled-system/jsx'
import { container } from '#styled-system/patterns'

import { rootRoute } from './routes'

export const App = reatomComponent(function App() {
	const match = rootRoute()

	if (!match) {
		return null
	}

	const pending = rootRoute.loader.pending()
	const ready = rootRoute.loader.ready()
	const error = rootRoute.loader.error()

	if (!ready && pending === 0 && !error) {
		void rootRoute.loader()
	}

	if (error) {
		return (
			<main className={container({ maxW: '4xl', p: '8' })}>
				<styled.h1 fontSize="4xl" fontWeight="bold" mb="6">
					Modern Stack
				</styled.h1>
				<styled.p color="red.700">Failed to load counters.</styled.p>
			</main>
		)
	}

	if (!ready) {
		return (
			<main className={container({ maxW: '4xl', p: '8' })}>
				<styled.h1 fontSize="4xl" fontWeight="bold" mb="6">
					Modern Stack
				</styled.h1>
				<styled.p>Loading counters...</styled.p>
			</main>
		)
	}

	const data = rootRoute.loader.data()
	assert(data, 'Root route data is required')
	const { counters } = data

	return (
		<main className={container({ maxW: '4xl', p: '8' })}>
			<styled.h1 fontSize="4xl" fontWeight="bold" mb="6">
				Modern Stack
			</styled.h1>
			{counters.map((counter, index) => (
				<Fragment key={counter.id}>
					<styled.h2 fontSize="2xl" fontWeight="semibold" mb="4" mt={index > 0 ? '8' : '0'}>
						{counter.label}
					</styled.h2>
					<Counter countAtom={counter.countAtom} />
				</Fragment>
			))}
		</main>
	)
})
