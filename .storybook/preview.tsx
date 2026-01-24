import '../src/index.css'
import '../src/reatom.init.ts'
import { context } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import addonA11y from '@storybook/addon-a11y'
import { definePreview } from '@storybook/react-vite'
import { useMemo, type PropsWithChildren } from 'react'

function ReatomDecorator({ children }: PropsWithChildren) {
	// Create fresh context once per story mount to prevent state pollution
	const frame = useMemo(() => context.start(), [])
	return <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
}

const preview = definePreview({
	addons: [addonA11y()],
	decorators: [
		(Story) => (
			<ReatomDecorator>
				<Story />
			</ReatomDecorator>
		),
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'error',
		},
	},
})

export default preview
