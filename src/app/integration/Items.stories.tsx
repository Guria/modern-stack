import { http, HttpResponse } from 'msw'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { ITEMS_API_PATH } from '#entities/item'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const itemsApiUrl = composeApiUrl(ITEMS_API_PATH)

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	itemsLoadingStateAppears: (canvas) => canvas.findByRole('status', { name: 'Loading items page' }),
	itemsErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load items' }),
	maybeItemsErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load items' }),
	itemsAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeItemsList: async () => {
		await I.see((canvas) => canvas.findByText('Wireless Headphones'))
		await I.see((canvas) => canvas.findByText('Standing Desk'))
		await I.see((canvas) => canvas.findByText('Mechanical Keyboard'))
	},
	seeCategoryBadges: async () => {
		await I.see((canvas) =>
			canvas.findAllByText('Electronics').then((els: HTMLElement[]) => els[0]!),
		)
		await I.see((canvas) => canvas.findAllByText('Furniture').then((els: HTMLElement[]) => els[0]!))
	},
	seeOutOfStockBadge: async () => {
		await I.see((canvas) =>
			canvas.findAllByText('Out of Stock').then((els: HTMLElement[]) => els[0]!),
		)
	},
	seeItemsError: async () => {
		await I.see(loc.itemsErrorHeadingAppears)
		await I.see(loc.itemsAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	title: 'Integration/Items',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'items' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders items list', async () => {
	await I.seeItemsList()
})

Default.test('shows category badges', async () => {
	await I.seeCategoryBadges()
})

Default.test('shows Out of Stock badge', async () => {
	await I.seeOutOfStockBadge()
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders items list', async () => {
	await I.seeItemsList()
})

DefaultMobile.test('[mobile] shows category badges', async () => {
	await I.seeCategoryBadges()
})

export const HandlesItemsLoadServerError = meta.story({
	name: 'Items Load Server Error',
	parameters: {
		msw: {
			handlers: [http.get(itemsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesItemsLoadServerError.test('shows error state when items request fails', async () => {
	await I.seeItemsError()
	await I.see((canvas) => canvas.findByText("We couldn't load the items. Try again in a moment."))
})

HandlesItemsLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.itemsAlertRegionAppears)
})

HandlesItemsLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesItemsLoadServerErrorMobile = meta.story({
	name: 'Items Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(itemsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesItemsLoadServerErrorMobile.test(
	'[mobile] shows error state when items request fails',
	async () => {
		await I.seeItemsError()
		await I.see((canvas) => canvas.findByText("We couldn't load the items. Try again in a moment."))
	},
)

HandlesItemsLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.itemsAlertRegionAppears)
})

HandlesItemsLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenItemsRequestNeverResolves = meta.story({
	name: 'Items Request Loading State',
	parameters: {
		msw: {
			handlers: [http.get(itemsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenItemsRequestNeverResolves.test(
	'keeps loading state for pending items request',
	async () => {
		await I.see(loc.itemsLoadingStateAppears)
		await I.dontSee(loc.maybeItemsErrorHeading)
	},
)

export const KeepsLoadingWhenItemsRequestNeverResolvesMobile = meta.story({
	name: 'Items Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(itemsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenItemsRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending items request',
	async () => {
		await I.see(loc.itemsLoadingStateAppears)
		await I.dontSee(loc.maybeItemsErrorHeading)
	},
)
