import preview from '#.storybook/preview'
import { App } from '#app/App'
import { itemList } from '#entities/item/mocks/handlers'
import { itemsActor as I } from '#pages/items/testing'

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
			handlers: { itemList: itemList.error },
		},
	},
})

HandlesItemsLoadServerError.test('shows error state when items request fails', async () => {
	await I.seeError()
	await I.seeText("We couldn't load the items. Try again in a moment.")
})

export const HandlesItemsLoadServerErrorMobile = meta.story({
	name: 'Items Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesItemsLoadServerError.input.parameters,
})

HandlesItemsLoadServerErrorMobile.test(
	'[mobile] shows error state when items request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the items. Try again in a moment.")
	},
)

export const KeepsLoadingWhenItemsRequestNeverResolves = meta.story({
	name: 'Items Request Loading State',
	parameters: {
		msw: {
			handlers: { itemList: itemList.loading },
		},
	},
})

KeepsLoadingWhenItemsRequestNeverResolves.test(
	'keeps loading state for pending items request',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenItemsRequestNeverResolvesMobile = meta.story({
	name: 'Items Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenItemsRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenItemsRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending items request',
	async () => {
		await I.seeLoading()
	},
)
