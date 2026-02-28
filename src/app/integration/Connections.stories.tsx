import preview from '#.storybook/preview'
import { App } from '#app/App'
import { connectionDetail, connectionList } from '#entities/connection/mocks/handlers'
import { connectionsActor as I, connectionsLoc as loc } from '#pages/connections/testing'

const meta = preview.meta({
	title: 'Integration/Connections',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'connections' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders connection list with all connections', async () => {
	await I.seeConnectionList()
})

Default.test('shows no-selection message when no connection selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows connection detail when connection is clicked', async () => {
	await I.clickItem('Stripe API')
	await I.seeDetail('Stripe API')
})

Default.test('shows all detail paragraphs in connection detail', async () => {
	await I.clickItem('Stripe API')

	const detail = await I.see(loc.detailRegionAppears)
	await I.see(loc.connectionHeading('Stripe API').within(detail))
	await I.seeText(/Connected to Stripe API v2023-10-16/, detail)
	await I.seeText(/Webhook endpoint configured/, detail)
	await I.seeText(/Average response latency/, detail)
	await I.seeText(/Rate limit headroom/, detail)
})

Default.test('displays correct status badges for all statuses', async () => {
	await I.seeStatusBadges()
})

Default.test('displays correct type badges for all types', async () => {
	await I.seeTypeBadges()
})

Default.test('can select different connections', async () => {
	await I.clickItem('Stripe API')
	await I.seeDetail('Stripe API')

	await I.clickItem('Analytics DB')
	await I.seeDetail('Analytics DB')
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders connection list with all connections', async () => {
	await I.seeConnectionList()
})

DefaultMobile.test('[mobile] shows connection list when no connection is selected', async () => {
	await I.seeConnectionList()
})

DefaultMobile.test('[mobile] shows connection detail when connection is clicked', async () => {
	await I.clickItem('Stripe API')
	await I.seeDetail('Stripe API')
})

DefaultMobile.test('[mobile] shows all detail paragraphs in connection detail', async () => {
	await I.clickItem('Stripe API')

	const detail = await I.see(loc.detailRegionAppears)
	await I.see(loc.connectionHeading('Stripe API').within(detail))
	await I.seeText(/Connected to Stripe API v2023-10-16/, detail)
	await I.seeText(/Webhook endpoint configured/, detail)
	await I.seeText(/Average response latency/, detail)
	await I.seeText(/Rate limit headroom/, detail)
})

DefaultMobile.test('[mobile] displays correct status badges for all statuses', async () => {
	await I.seeStatusBadges()
})

DefaultMobile.test('[mobile] displays correct type badges for all types', async () => {
	await I.seeTypeBadges()
})

DefaultMobile.test('[mobile] can select different connections', async () => {
	await I.clickItem('Stripe API')
	await I.seeDetail('Stripe API')

	await I.goBack()

	await I.clickItem('Analytics DB')
	await I.seeDetail('Analytics DB')
})

export const HandlesConnectionsLoadServerError = meta.story({
	name: 'Connections Load Server Error',
	parameters: {
		msw: {
			handlers: { connectionList: connectionList.error },
		},
	},
})

HandlesConnectionsLoadServerError.test(
	'shows error state when connections request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the connection list. Try again in a moment.")
	},
)

export const HandlesConnectionsLoadServerErrorMobile = meta.story({
	name: 'Connections Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesConnectionsLoadServerError.input.parameters,
})

HandlesConnectionsLoadServerErrorMobile.test(
	'[mobile] shows error state when connections request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the connection list. Try again in a moment.")
	},
)

export const KeepsLoadingWhenConnectionsRequestNeverResolves = meta.story({
	name: 'Connections Request Loading State',
	parameters: {
		msw: {
			handlers: { connectionList: connectionList.loading },
		},
	},
})

KeepsLoadingWhenConnectionsRequestNeverResolves.test(
	'shows loading state while connections request is pending',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenConnectionsRequestNeverResolvesMobile = meta.story({
	name: 'Connections Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenConnectionsRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenConnectionsRequestNeverResolvesMobile.test(
	'[mobile] shows loading state while connections request is pending',
	async () => {
		await I.seeLoading()
	},
)

export const HandlesConnectionDetailServerError = meta.story({
	name: 'Connection Detail Server Error',
	parameters: {
		msw: {
			handlers: { connectionDetail: connectionDetail.error },
		},
	},
})

HandlesConnectionDetailServerError.test(
	'shows not found when connection detail request fails',
	async () => {
		await I.clickItem('Stripe API')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.connectionHeading('Connection not found').within(detail))
		await I.seeText(/No connection exists for id/, detail)
	},
)

export const HandlesConnectionDetailServerErrorMobile = meta.story({
	name: 'Connection Detail Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesConnectionDetailServerError.input.parameters,
})

HandlesConnectionDetailServerErrorMobile.test(
	'[mobile] shows not found when connection detail request fails',
	async () => {
		await I.clickItem('Stripe API')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.connectionHeading('Connection not found').within(detail))
		await I.seeText(/No connection exists for id/, detail)
	},
)

export const KeepsLoadingWhenConnectionDetailNeverResolves = meta.story({
	name: 'Connection Detail Loading State',
	parameters: {
		msw: {
			handlers: { connectionDetail: connectionDetail.loading },
		},
	},
})

KeepsLoadingWhenConnectionDetailNeverResolves.test(
	'shows detail loading state while connection detail is pending',
	async () => {
		await I.clickItem('Stripe API')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.connectionDetailLoading.within(detail))
		await I.dontSee(loc.maybeConnectionHeading('Stripe API').within(detail))
		await I.dontSeeText('Connection not found', detail)
	},
)

export const KeepsLoadingWhenConnectionDetailNeverResolvesMobile = meta.story({
	name: 'Connection Detail Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenConnectionDetailNeverResolves.input.parameters,
})

KeepsLoadingWhenConnectionDetailNeverResolvesMobile.test(
	'[mobile] shows detail loading state while connection detail is pending',
	async () => {
		await I.clickItem('Stripe API')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.connectionDetailLoading.within(detail))
		await I.dontSee(loc.maybeConnectionHeading('Stripe API').within(detail))
		await I.dontSeeText('Connection not found', detail)
	},
)
