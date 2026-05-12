import { button, createActor, heading, role, text, withRetryAndLoading } from '#shared/test'

export const dashboardLoc = {
	heading: heading('Dashboard'),
}

export const dashboardActor = createActor()
	.extend(withRetryAndLoading('Loading dashboard page'))
	.extend((I) => ({
		seeError: async () => {
			await I.see(heading('Could not load dashboard'))
			await I.see(role('alert'))
			await I.see(button('Try again'))
		},
		seeDashboardContent: async () => {
			await I.see(dashboardLoc.heading)
			await I.see(text('Total Revenue'))
			await I.see(text('Active Users'))
		},
	}))
