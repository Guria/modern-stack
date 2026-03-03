import { createActor, heading } from '#shared/test'

export const settingsLoc = {
	heading: heading('Settings'),
	profileSection: heading('Profile'),
	notificationsSection: heading('Notifications'),
	appearanceSection: heading('Appearance'),
}

export const settingsActor = createActor().extend((I) => ({
	seeSettingsContent: async () => {
		await I.see(settingsLoc.heading)
		await I.see(settingsLoc.profileSection)
		await I.see(settingsLoc.notificationsSection)
		await I.see(settingsLoc.appearanceSection)
	},
}))
