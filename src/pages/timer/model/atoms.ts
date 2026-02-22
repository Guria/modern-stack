import { action, atom, computed, withChangeHook, wrap } from '@reatom/core'

export const timerDurationAtom = atom(300, 'timer.duration')
export const timerRemainingAtom = atom(300, 'timer.remaining')

const tick = action(() => {
	const remaining = timerRemainingAtom() - 1
	if (remaining <= 0) {
		timerRemainingAtom.set(0)
		timerRunningAtom.set(false)
	} else {
		timerRemainingAtom.set(remaining)
	}
}, 'timer.tick')

let intervalId: ReturnType<typeof setInterval> | null = null

export const timerRunningAtom = atom(false, 'timer.running').extend(
	withChangeHook((isRunning) => {
		if (intervalId !== null) {
			clearInterval(intervalId)
			intervalId = null
		}
		if (isRunning) {
			intervalId = setInterval(wrap(tick), 1000)
		}
	}),
)

export const timerProgressAtom = computed(
	() => (timerDurationAtom() === 0 ? 0 : timerRemainingAtom() / timerDurationAtom()),
	'timer.progress',
)

export const startTimer = action(() => {
	if (timerRemainingAtom() <= 0) return
	timerRunningAtom.set(true)
}, 'timer.start')

export const pauseTimer = action(() => {
	timerRunningAtom.set(false)
}, 'timer.pause')

export const resetTimer = action(() => {
	timerRunningAtom.set(false)
	timerRemainingAtom.set(timerDurationAtom())
}, 'timer.reset')

export const setDuration = action((seconds: number) => {
	timerDurationAtom.set(seconds)
	if (!timerRunningAtom()) {
		timerRemainingAtom.set(seconds)
	}
}, 'timer.setDuration')

export function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
