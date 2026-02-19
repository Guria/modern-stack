import { http, HttpResponse } from 'msw'
import { expect, within } from 'storybook/test'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { CONNECTIONS_API_PATH } from '#entities/connection'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const connectionsApiUrl = composeApiUrl(CONNECTIONS_API_PATH)
const connectionDetailApiUrl = composeApiUrl(`${CONNECTIONS_API_PATH}/:connectionId`)

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	noSelectionMessageAppears: (canvas) => canvas.findByText('Select a connection to view details.'),
	connectionsLoadingStateAppears: (canvas) =>
		canvas.findByRole('status', { name: 'Loading connections page' }),
	connectionsErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load connections' }),
	maybeConnectionsErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load connections' }),
	connectionsAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
	detailRegionAppears: (canvas) => canvas.findByRole('main'),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	goBackToConnections: async () => {
		await I.click((canvas) => canvas.findByLabelText('Back to connections'))
	},
	clickConnection: async (name: string | RegExp) => {
		const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name
		await I.click((canvas) => canvas.findByRole('link', { name: pattern }))
	},
	seeConnectionList: async () => {
		await I.see((canvas) => canvas.findByRole('link', { name: /Stripe API/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Analytics DB/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Slack Notifications/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Auth0 SSO/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /S3 Data Lake/i }))
	},
	seeStatusBadges: async () => {
		await I.see((canvas) => canvas.findAllByText('Active').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) => canvas.findAllByText('Inactive').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) => canvas.findAllByText('Error').then((els: HTMLElement[]) => els[0]!))
	},
	seeTypeBadges: async () => {
		await I.see((canvas) => canvas.findAllByText('API').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) => canvas.findAllByText('Database').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) => canvas.findAllByText('Webhook').then((els: HTMLElement[]) => els[0]!))
	},
	seeConnectionDetail: async (name: string | RegExp) => {
		await I.see((canvas) => canvas.findByRole('heading', { name, level: 1 }))
	},
	seeConnectionsError: async () => {
		await I.see(loc.connectionsErrorHeadingAppears)
		await I.see(loc.connectionsAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'connections' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders connection list with all connections', async () => {
	await I.seeConnectionList()
})

Default.test('shows no-selection message when no connection selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows connection detail when connection is clicked', async () => {
	await I.clickConnection('Stripe API')
	await I.seeConnectionDetail('Stripe API')
})

Default.test('shows all detail paragraphs in connection detail', async () => {
	await I.clickConnection('Stripe API')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByRole('heading', { name: 'Stripe API', level: 1 })
	await detailCanvas.findByText(/Connected to Stripe API v2023-10-16/)
	await detailCanvas.findByText(/Webhook endpoint configured/)
	await detailCanvas.findByText(/Average response latency/)
	await detailCanvas.findByText(/Rate limit headroom/)
})

Default.test('displays correct status badges for all statuses', async () => {
	await I.seeStatusBadges()
})

Default.test('displays correct type badges for all types', async () => {
	await I.seeTypeBadges()
})

Default.test('can select different connections', async () => {
	await I.clickConnection('Stripe API')
	await I.seeConnectionDetail('Stripe API')

	await I.clickConnection('Analytics DB')
	await I.seeConnectionDetail('Analytics DB')
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders connection list with all connections', async () => {
	await I.seeConnectionList()
})

DefaultMobile.test('[mobile] shows connection list when no connection is selected', async () => {
	await I.seeConnectionList()
})

DefaultMobile.test('[mobile] shows connection detail when connection is clicked', async () => {
	await I.clickConnection('Stripe API')
	await I.seeConnectionDetail('Stripe API')
})

DefaultMobile.test('[mobile] shows all detail paragraphs in connection detail', async () => {
	await I.clickConnection('Stripe API')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByRole('heading', { name: 'Stripe API', level: 1 })
	await detailCanvas.findByText(/Connected to Stripe API v2023-10-16/)
	await detailCanvas.findByText(/Webhook endpoint configured/)
	await detailCanvas.findByText(/Average response latency/)
	await detailCanvas.findByText(/Rate limit headroom/)
})

DefaultMobile.test('[mobile] displays correct status badges for all statuses', async () => {
	await I.seeStatusBadges()
})

DefaultMobile.test('[mobile] displays correct type badges for all types', async () => {
	await I.seeTypeBadges()
})

DefaultMobile.test('[mobile] can select different connections', async () => {
	await I.clickConnection('Stripe API')
	await I.seeConnectionDetail('Stripe API')

	await I.goBackToConnections()

	await I.clickConnection('Analytics DB')
	await I.seeConnectionDetail('Analytics DB')
})

export const HandlesConnectionsLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(connectionsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConnectionsLoadServerError.test(
	'shows error state when connections request fails',
	async () => {
		await I.seeConnectionsError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the connection list. Try again in a moment."),
		)
	},
)

HandlesConnectionsLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.connectionsAlertRegionAppears)
})

HandlesConnectionsLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesConnectionsLoadServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(connectionsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConnectionsLoadServerErrorMobile.test(
	'[mobile] shows error state when connections request fails',
	async () => {
		await I.seeConnectionsError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the connection list. Try again in a moment."),
		)
	},
)

HandlesConnectionsLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.connectionsAlertRegionAppears)
})

HandlesConnectionsLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenConnectionsRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(connectionsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenConnectionsRequestNeverResolves.test(
	'shows loading state while connections request is pending',
	async () => {
		await I.see(loc.connectionsLoadingStateAppears)
		await I.dontSee(loc.maybeConnectionsErrorHeading)
	},
)

export const KeepsLoadingWhenConnectionsRequestNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(connectionsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenConnectionsRequestNeverResolvesMobile.test(
	'[mobile] shows loading state while connections request is pending',
	async () => {
		await I.see(loc.connectionsLoadingStateAppears)
		await I.dontSee(loc.maybeConnectionsErrorHeading)
	},
)

export const HandlesConnectionDetailServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(connectionDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConnectionDetailServerError.test(
	'shows not found when connection detail request fails',
	async () => {
		await I.clickConnection('Stripe API')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Connection not found' })
		await detailCanvas.findByText('No connection exists for id "1".')
	},
)

export const HandlesConnectionDetailServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(connectionDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConnectionDetailServerErrorMobile.test(
	'[mobile] shows not found when connection detail request fails',
	async () => {
		await I.clickConnection('Stripe API')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Connection not found' })
		await detailCanvas.findByText('No connection exists for id "1".')
	},
)

export const KeepsLoadingWhenConnectionDetailNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(connectionDetailApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenConnectionDetailNeverResolves.test(
	'shows detail loading state while connection detail is pending',
	async () => {
		await I.clickConnection('Stripe API')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading connection detail',
		})
		expect(loadingState).toBeInTheDocument()
		expect(
			detailCanvas.queryByRole('heading', { name: 'Stripe API', level: 1 }),
		).not.toBeInTheDocument()
		expect(detailCanvas.queryByText('Connection not found')).not.toBeInTheDocument()
	},
)

export const KeepsLoadingWhenConnectionDetailNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(connectionDetailApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenConnectionDetailNeverResolvesMobile.test(
	'[mobile] shows detail loading state while connection detail is pending',
	async () => {
		await I.clickConnection('Stripe API')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading connection detail',
		})
		expect(loadingState).toBeInTheDocument()
		expect(
			detailCanvas.queryByRole('heading', { name: 'Stripe API', level: 1 }),
		).not.toBeInTheDocument()
		expect(detailCanvas.queryByText('Connection not found')).not.toBeInTheDocument()
	},
)
