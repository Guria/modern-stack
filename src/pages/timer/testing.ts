import { button, createActor, heading, text } from '#shared/test'

export const timerLoc = {
	heading: heading('Timer'),
	display: text('05:00'),
	startButton: button('Start'),
	pauseButton: button('Pause'),
	resetButton: button('Reset'),
	preset10s: button('10s'),
	preset1m: button('1m'),
	preset5m: button('5m'),
	preset10m: button('10m'),
	preset25m: button('25m'),
}

export const timerActor = createActor().extend((I) => ({
	seeTimerContent: async () => {
		await I.see(timerLoc.heading)
		await I.see(timerLoc.display)
		await I.see(timerLoc.startButton)
		await I.see(timerLoc.resetButton)
	},
	seePresets: async () => {
		await I.see(timerLoc.preset10s)
		await I.see(timerLoc.preset1m)
		await I.see(timerLoc.preset5m)
		await I.see(timerLoc.preset10m)
		await I.see(timerLoc.preset25m)
	},
}))
