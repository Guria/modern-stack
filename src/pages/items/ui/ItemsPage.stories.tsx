import { expect } from 'storybook/test'

import preview from '#.storybook/preview'
import { itemsMockData } from '#entities/item/mocks/data'
import { assert, createActor, loc, type ArrayLocator } from '#shared/test'

import { ItemsPage } from './ItemsPage'

const heading = loc((canvas) => canvas.findByRole('heading', { name: 'Items' }))
const item = (name: string) => loc((canvas) => canvas.findByText(name))
const maybeItem = (name: string) => loc((canvas) => canvas.queryByText(name))
const sortSelect = loc((canvas) => canvas.findByRole('combobox', { name: /Sort by/i }))
const categorySelect = loc((canvas) => canvas.findByRole('combobox', { name: /Category/i }))
const stockSelect = loc((canvas) => canvas.findByRole('combobox', { name: /Stock/i }))
const sortDirectionBtn = loc((canvas) => canvas.findByRole('button', { name: /Asc|Desc/ }))
const priceElements: ArrayLocator = (canvas) => canvas.findAllByText(/^\$/)
const noItemsMessage = loc((canvas) => canvas.findByText('No items match the current filters.'))

const I = createActor().extend((I) => ({
	seeItem: async (name: string) => {
		await I.see(item(name))
	},
	dontSeeItem: async (name: string) => {
		await I.dontSee(maybeItem(name))
	},
	selectSort: async (option: string) => {
		await I.selectOption(sortSelect, option)
	},
	selectCategory: async (option: string) => {
		await I.selectOption(categorySelect, option)
	},
	selectStock: async (option: string) => {
		await I.selectOption(stockSelect, option)
	},
	toggleSortDirection: async () => {
		await I.click(sortDirectionBtn)
	},
}))

const meta = preview.meta({
	title: 'Pages/Items',
	component: ItemsPage,
	args: {
		items: itemsMockData,
		getItemHref: (itemId: string) => `/items/${itemId}`,
	},
	parameters: { layout: 'fullscreen' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders items list', async () => {
	await I.see(heading)
	await I.seeItem('Wireless Headphones')
	await I.seeItem('Standing Desk')
})

Default.test('filters by category: Electronics', async () => {
	await I.selectCategory('Electronics')
	await I.seeItem('Wireless Headphones')
	await I.seeItem('Mechanical Keyboard')
	await I.dontSeeItem('Standing Desk')
	await I.dontSeeItem('Merino Wool Sweater')
})

Default.test('filters by stock: In Stock', async () => {
	await I.selectStock('In Stock')
	await I.seeItem('Wireless Headphones')
	await I.seeItem('Standing Desk')
	await I.dontSeeItem('Merino Wool Sweater') // Sweater is Out of Stock
})

Default.test('filters by stock: Out of Stock', async () => {
	await I.selectStock('Out of Stock')
	await I.seeItem('Merino Wool Sweater')
	await I.seeItem('Ergonomic Chair')
	await I.dontSeeItem('Wireless Headphones') // Headphones are In Stock
})

Default.test('sorts by price: Ascending', async () => {
	await I.selectSort('Price')
	// Default is Ascending
	const items = (await I.resolveLocator(priceElements)) as HTMLElement[]
	const prices = await Promise.all(
		items.map((el: unknown) => {
			assert(el instanceof HTMLElement, 'Expected HTMLElement')
			return (el.textContent ?? '').replace('$', '')
		}),
	)
	const numericPrices = prices.map(Number)
	const sortedPrices = [...numericPrices].sort((a, b) => a - b)
	expect(numericPrices).toEqual(sortedPrices)
})

Default.test('sorts by price: Descending', async () => {
	await I.selectSort('Price')
	await I.toggleSortDirection()
	const items = (await I.resolveLocator(priceElements)) as HTMLElement[]
	const prices = await Promise.all(
		items.map((el: unknown) => {
			assert(el instanceof HTMLElement, 'Expected HTMLElement')
			return (el.textContent ?? '').replace('$', '')
		}),
	)
	const numericPrices = prices.map(Number)
	const sortedPrices = [...numericPrices].sort((a, b) => b - a)
	expect(numericPrices).toEqual(sortedPrices)
})

Default.test('shows no items message when filters match nothing', async () => {
	// Electronics + Out of Stock = 0 results in mock data
	await I.selectCategory('Electronics')
	await I.selectStock('Out of Stock')
	await I.see(noItemsMessage)
})
