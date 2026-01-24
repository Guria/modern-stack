import { Counter } from '#counter/Counter.tsx'
import { css } from '#styled-system/css'

export function App() {
	return (
		<main className={css({ maxW: '4xl', mx: 'auto', p: '8' })}>
			<h1 className={css({ fontSize: '4xl', fontWeight: 'bold', mb: '6' })}>Modern Stack</h1>
			<Counter initial={10} />
		</main>
	)
}
