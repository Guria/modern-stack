import { button, createActor, heading, text } from '#shared/test'

export const timerLoc = {
	headingAppears: heading('Timer'),
	displayAppears: text('05:00'),
	startButtonAppears: button('Start'),
	resetButtonAppears: button('Reset'),
}

export const timerActor = createActor().extend((I) => ({
	seeTimerContent: async () => {
		await I.see(timerLoc.headingAppears)
		await I.see(timerLoc.displayAppears)
		await I.see(timerLoc.startButtonAppears)
		await I.see(timerLoc.resetButtonAppears)
	},
}))
