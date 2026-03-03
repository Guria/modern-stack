import { button, createActor, heading, role, text } from '#shared/test'

export const itemsActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load items'))
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading items page'))
		await I.dontSee(role('alert'))
	},
	seeItemsList: async () => {
		await I.see(text('Wireless Headphones'))
		await I.see(text('Standing Desk'))
		await I.see(text('Mechanical Keyboard'))
	},
	seeCategoryBadges: async () => {
		await I.see(text('Electronics').all())
		await I.see(text('Furniture').all())
	},
	seeOutOfStockBadge: async () => {
		await I.see(text('Out of Stock').all())
	},
}))
