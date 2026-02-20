import { expect } from 'storybook/test'

import preview from '#.storybook/preview'
import { itemsMockData } from '#entities/item/mocks/data'
import { createMyself, type Locator } from '#shared/test'

import { ItemNoSelection } from './ItemNoSelection'
import { ItemsPage } from './ItemsPage'

type Canvas = Parameters<Locator>[0]

const loc = {
	heading: (canvas: Canvas) => canvas.findByRole('heading', { name: 'Items' }),
	item: (name: string) => (canvas: Canvas) => canvas.findByText(name),
	maybeItem: (name: string) => (canvas: Canvas) => canvas.queryByText(name),
	sortSelect: async (canvas: Canvas) => {
		const labels = await canvas.findAllByText(/Sort by/i)
		const label = labels.find((el: Element) => el.tagName.toLowerCase() === 'label')
		return label!.querySelector('button')
	},
	categorySelect: async (canvas: Canvas) => {
		const labels = await canvas.findAllByText(/Category/i)
		const label = labels.find((el: Element) => el.tagName.toLowerCase() === 'label')
		return label!.querySelector('button')
	},
	stockSelect: async (canvas: Canvas) => {
		const labels = await canvas.findAllByText(/Stock/i)
		const label = labels.find((el: Element) => el.tagName.toLowerCase() === 'label')
		return label!.querySelector('button')
	},
	sortDirectionBtn: (canvas: Canvas) => canvas.findByRole('button', { name: /Asc|Desc/ }),
	noItemsMessage: (canvas: Canvas) => canvas.findByText('No items match the current filters.'),
} satisfies Record<string, Locator | ((name: string) => Locator)>

const I = createMyself((I) => ({
	seeItem: async (name: string) => {
		await I.see(loc.item(name))
	},
	dontSeeItem: async (name: string) => {
		await I.dontSee(loc.maybeItem(name))
	},
	selectSort: async (option: string) => {
		await I.selectOption(loc.sortSelect, option)
	},
	selectCategory: async (option: string) => {
		await I.selectOption(loc.categorySelect, option)
	},
	selectStock: async (option: string) => {
		await I.selectOption(loc.stockSelect, option)
	},
	toggleSortDirection: async () => {
		await I.click(loc.sortDirectionBtn)
	},
}))

const meta = preview.meta({
	title: 'Pages/Items',
	component: ItemsPage,
	args: {
		items: itemsMockData,
		selectedItemId: undefined,
		getItemHref: (itemId: string) => `/items/${itemId}`,
		detail: <ItemNoSelection />,
	},
	parameters: { layout: 'fullscreen' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders items list', async () => {
	await I.see(loc.heading)
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
	const items = await I.resolveLocator((canvas: Canvas) => canvas.findAllByText(/^\$/))
	const prices = await Promise.all(items.map((el: HTMLElement) => el.textContent!.replace('$', '')))
	const numericPrices = prices.map(Number)
	const sortedPrices = [...numericPrices].sort((a, b) => a - b)
	expect(numericPrices).toEqual(sortedPrices)
})

Default.test('sorts by price: Descending', async () => {
	await I.selectSort('Price')
	await I.toggleSortDirection()
	const items = await I.resolveLocator((canvas: Canvas) => canvas.findAllByText(/^\$/))
	const prices = await Promise.all(items.map((el: HTMLElement) => el.textContent!.replace('$', '')))
	const numericPrices = prices.map(Number)
	const sortedPrices = [...numericPrices].sort((a, b) => b - a)
	expect(numericPrices).toEqual(sortedPrices)
})

Default.test('shows no items message when filters match nothing', async () => {
	// Filter for Food AND Out of Stock (only Matcha Powder is Food and Out of Stock in mocks)
	// Wait, Matcha Powder IS Food and Out of Stock.
	// Let's filter for Furniture AND Out of Stock (only Ergonomic Chair)
	// Let's filter for Clothing AND Out of Stock (only Merino Wool Sweater)
	// If I filter for Food AND In Stock (Organic Coffee Beans, Dark Chocolate Bar)

	// Let's use a combination that has 0 results.
	// Actually, I can just use a category that has no items in the mock if I had one.
	// Or just check a specific combination.

	// In the mock:
	// electronics: 1(T), 4(T), 7(T) - all in stock
	// furniture: 2(T), 6(F), 9(T) - 6 is out of stock
	// clothing: 3(F), 8(T), 11(T) - 3 is out of stock
	// food: 5(T), 10(T), 12(F) - 12 is out of stock

	// So Electronics + Out of Stock should have 0 results.
	await I.selectCategory('Electronics')
	await I.selectStock('Out of Stock')
	await I.see(loc.noItemsMessage)
})
