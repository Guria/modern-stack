import { createActor, textAll } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'

export const itemsLoc = {
	...dataPageLoc('items'),
}

export const itemsActor = createActor()
	.extend(dataPage(itemsLoc))
	.extend((I) => ({
		seeItemsList: async () => {
			await I.seeText('Wireless Headphones')
			await I.seeText('Standing Desk')
			await I.seeText('Mechanical Keyboard')
		},
		seeCategoryBadges: async () => {
			await I.see(textAll('Electronics'))
			await I.see(textAll('Furniture'))
		},
		seeOutOfStockBadge: async () => {
			await I.see(textAll('Out of Stock'))
		},
	}))
