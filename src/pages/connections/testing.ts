import { backButton, button, createActor, heading, link, role, text } from '#shared/test'

export const connectionsLoc = {
	detailLoading: role('status', 'Loading connection detail'),
}

export const connectionsActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load connections'))
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading connections page'))
		await I.dontSee(role('alert'))
	},
	goBack: async () => {
		await I.click(backButton('connections'))
	},
	seeConnectionList: async () => {
		await I.see(link(/Stripe API/i))
		await I.see(link(/Analytics DB/i))
		await I.see(link(/Slack Notifications/i))
		await I.see(link(/Auth0 SSO/i))
		await I.see(link(/S3 Data Lake/i))
	},
	seeStatusBadges: async () => {
		await I.see(text('Active').all())
		await I.see(text('Inactive').all())
		await I.see(text('Error').all())
	},
	seeTypeBadges: async () => {
		await I.see(text('API').all())
		await I.see(text('Database').all())
		await I.see(text('Webhook').all())
	},
}))
