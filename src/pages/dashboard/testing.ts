import { button, createActor, heading, role, text } from '#shared/test'

export const dashboardLoc = {
	heading: heading('Dashboard'),
}

export const dashboardActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load dashboard').wait())
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading dashboard page').wait())
		await I.dontSee(role('alert'))
	},
	seeDashboardContent: async () => {
		await I.see(dashboardLoc.heading.wait())
		await I.see(text('Total Revenue'))
		await I.see(text('Active Users'))
	},
}))
