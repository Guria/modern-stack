import { expect } from 'storybook/test'

import preview from '#.storybook/preview'
import { itemsMockData } from '#entities/item/mocks/data'
import { assert, createActor, heading, role, text } from '#shared/test'

import { ItemsPage } from './ItemsPage'

const I = createActor().extend((I) => ({
	seeItem: async (name: string) => {
		await I.see(text(name))
	},
	dontSeeItem: async (name: string) => {
		await I.dontSee(text(name))
	},
	selectSort: async (option: string) => {
		await I.selectOption(role('combobox', /Sort by/i), option)
	},
	selectCategory: async (option: string) => {
		await I.selectOption(role('combobox', /Category/i), option)
	},
	selectStock: async (option: string) => {
		await I.selectOption(role('combobox', /Stock/i), option)
	},
	toggleSortDirection: async () => {
		await I.click(role('button', /Asc|Desc/))
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
	await I.see(heading('Items'))
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
	const items = (await I.resolveLocator(text(/^\$/).all().wait())) as HTMLElement[]
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
	const items = (await I.resolveLocator(text(/^\$/).all().wait())) as HTMLElement[]
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
	await I.see(text('No items match the current filters.'))
})
