import { createActor, heading, text } from '#shared/test'

export const usageLoc = {
	headingAppears: heading('Usage'),
	storageResetNoteAppears: text('Storage usage resets on the 1st of each month.'),
	breakdownHeadingAppears: heading('Breakdown'),
	documentsRowAppears: text('Documents'),
	mediaRowAppears: text('Media'),
	otherRowAppears: text('Other'),
}

export const usageActor = createActor().extend((I) => ({
	seeUsageContent: async () => {
		await I.see(usageLoc.headingAppears)
		await I.see(usageLoc.breakdownHeadingAppears)
		await I.see(usageLoc.documentsRowAppears)
		await I.see(usageLoc.mediaRowAppears)
		await I.see(usageLoc.otherRowAppears)
	},
}))
