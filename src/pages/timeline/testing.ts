import { button, createActor, heading, role, text } from '#shared/test'

export const timelineActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load timeline').wait())
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading timeline page').wait())
		await I.dontSee(role('alert'))
	},
	seeTimelineEvents: async () => {
		await I.see(text('Deployed v2.4.1 to production').wait())
		await I.see(text('Merged PR #482 - Auth token refresh'))
	},
	seeDateGroups: async () => {
		await I.see(text('Today').all().wait())
		await I.see(text('Yesterday').all())
	},
}))
