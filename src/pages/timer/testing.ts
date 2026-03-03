import { button, createActor, heading, text } from '#shared/test'

export const timerLoc = {
	heading: heading('Timer'),
	display: text('05:00'),
	startButton: button('Start'),
	resetButton: button('Reset'),
}

export const timerActor = createActor().extend((I) => ({
	seeTimerContent: async () => {
		await I.see(timerLoc.heading)
		await I.see(timerLoc.display)
		await I.see(timerLoc.startButton)
		await I.see(timerLoc.resetButton)
	},
}))
