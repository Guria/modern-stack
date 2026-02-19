import '../src/reatom.init'
import '../src/index.css'
import { context, urlAtom } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import addonA11y from '@storybook/addon-a11y'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
// oxlint-disable-next-line no-restricted-imports
import { useMemo, type PropsWithChildren } from 'react'

import { handlersArray } from '#app/mocks/handlers'
import { css } from '#styled-system/css'

import { setupStorybookUrl } from './setupStorybookUrl'
import { FALLBACK_VIEWPORT, getViewportSize } from './viewports'

initialize({
	onUnhandledRequest: 'bypass',
	quiet: true,
	serviceWorker: {
		url: `${import.meta.env['BASE_URL']}mockServiceWorker.js`,
	},
})

function ReatomDecorator({
	children,
	initialPath = '/',
}: PropsWithChildren<{ initialPath?: string }>) {
	const frame = useMemo(() => context.start(), [])
	frame.run(() => {
		setupStorybookUrl()
		// @ts-expect-error - Vite replaces this with the actual value at build time
		const base = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''
		// @ts-expect-error - Vite replaces this with the actual value at build time
		console.log({ initialPath, base, BASE_URL: import.meta.env.BASE_URL })
		urlAtom.go(base + initialPath)
	})
	return <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
}

const preview = definePreview({
	addons: [addonA11y()],
	loaders: [mswLoader],
	decorators: [
		(Story, { parameters }) => (
			<ReatomDecorator initialPath={parameters['initialPath']}>
				<Story />
			</ReatomDecorator>
		),
		(Story) => (
			<div className={css({ colorPalette: 'indigo' })}>
				<Story />
			</div>
		),
	],
	parameters: {
		a11y: { test: 'todo' },
		msw: { handlers: handlersArray },
	},
	beforeEach: async ({ globals }) => {
		if (!import.meta.env['VITEST']) return
		const { page } = await import('vitest/browser')
		const viewportGlobal = globals['viewport'] as { value?: string } | string | undefined
		const viewportName = typeof viewportGlobal === 'string' ? viewportGlobal : viewportGlobal?.value
		const viewport = (viewportName ? getViewportSize(viewportName) : null) ?? FALLBACK_VIEWPORT
		await page.viewport(viewport.width, viewport.height)
	},
})

export default preview
