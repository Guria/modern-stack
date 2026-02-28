import { createActor, heading } from '#shared/test'

export const settingsLoc = {
	headingAppears: heading('Settings'),
	profileSectionAppears: heading('Profile'),
	notificationsSectionAppears: heading('Notifications'),
	appearanceSectionAppears: heading('Appearance'),
}

export const settingsActor = createActor().extend((I) => ({
	seeSettingsContent: async () => {
		await I.see(settingsLoc.headingAppears)
		await I.see(settingsLoc.profileSectionAppears)
		await I.see(settingsLoc.notificationsSectionAppears)
		await I.see(settingsLoc.appearanceSectionAppears)
	},
}))
