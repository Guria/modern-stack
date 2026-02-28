import { button, heading, loc, type BaseActor, type Locator } from '#shared/test'

type DataPageLocs = {
	loadingStateAppears: Locator
	errorHeadingAppears: Locator
	maybeErrorHeading: Locator
	alertRegionAppears: Locator
	retryButtonAppears: Locator
}

export const dataPageLoc = (entityName: string) => ({
	loadingStateAppears: loc((canvas) =>
		canvas.findByRole('status', { name: `Loading ${entityName} page` }),
	),
	errorHeadingAppears: heading(`Could not load ${entityName}`),
	maybeErrorHeading: loc((canvas) =>
		canvas.queryByRole('heading', { name: `Could not load ${entityName}` }),
	),
	alertRegionAppears: loc((canvas) => canvas.findByRole('alert')),
	retryButtonAppears: button('Try again'),
})

export const dataPage = (locs: DataPageLocs) => (I: BaseActor) => ({
	seeError: async () => {
		await I.see(locs.errorHeadingAppears)
		await I.see(locs.alertRegionAppears)
		await I.see(locs.retryButtonAppears)
	},
	seeLoading: async () => {
		await I.see(locs.loadingStateAppears)
		await I.dontSee(locs.maybeErrorHeading)
	},
})
