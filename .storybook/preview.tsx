import { context } from '@reatom/core'

import '../src/index.css'
import '../src/reatom.init.ts'
import { reatomContext } from '@reatom/react'
import addonA11y from '@storybook/addon-a11y'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { useMemo, type PropsWithChildren } from 'react'

import { css } from '#styled-system/css'

initialize({ onUnhandledRequest: 'bypass' })

function ReatomDecorator({ children }: PropsWithChildren) {
	// Create fresh context once per story mount to prevent state pollution
	const frame = useMemo(() => context.start(), [])
	return <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
}

const preview = definePreview({
	addons: [addonA11y()],
	loaders: [mswLoader],
	decorators: [
		(Story) => (
			<ReatomDecorator>
				<Story />
			</ReatomDecorator>
		),
		(Story) => (
			<div className={css({ colorPalette: 'orange' })}>
				<Story />
			</div>
		),
	],
	parameters: {
		a11y: { test: 'error' },
		msw: { handlers: [] },
	},
})

export default preview
