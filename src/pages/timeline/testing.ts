import { createActor, textAll } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'

export const timelineLoc = {
	...dataPageLoc('timeline'),
}

export const timelineActor = createActor()
	.extend(dataPage(timelineLoc))
	.extend((I) => ({
		seeTimelineEvents: async () => {
			await I.seeText('Deployed v2.4.1 to production')
			await I.seeText('Merged PR #482 - Auth token refresh')
		},
		seeDateGroups: async () => {
			await I.see(textAll('Today'))
			await I.see(textAll('Yesterday'))
		},
	}))
