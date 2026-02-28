import { createActor, heading } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'

export const dashboardLoc = {
	headingAppears: heading('Dashboard'),
	...dataPageLoc('dashboard'),
}

export const dashboardActor = createActor()
	.extend(dataPage(dashboardLoc))
	.extend((I) => ({
		seeDashboardContent: async () => {
			await I.see(dashboardLoc.headingAppears)
			await I.seeText('Total Revenue')
			await I.seeText('Active Users')
		},
	}))
