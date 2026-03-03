import preview from '#.storybook/preview'
import { button, createActor, heading, text } from '#shared/test'

import { TimerPage } from './TimerPage'

const timerHeading = heading('Timer')
const startBtn = button('Start')
const pauseBtn = button('Pause')
const resetBtn = button('Reset')
const durationBtn = (label: string) => button(label)

const I = createActor()

const meta = preview.meta({
	title: 'Pages/Timer',
	component: TimerPage,
	parameters: { layout: 'centered' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders timer and starts/pauses/resets', async () => {
	await I.see(timerHeading)
	await I.see(text('05:00'))

	await I.click(startBtn)
	await I.see(pauseBtn)

	// We can't easily wait for a tick in storybook-test without mocked timers
	// but we can verify the button toggles.

	await I.click(pauseBtn)
	await I.see(startBtn)

	await I.click(resetBtn)
	await I.see(text('05:00'))
})

Default.test('changes duration', async () => {
	await I.click(durationBtn('1m'))
	await I.see(text('01:00'))

	await I.click(durationBtn('10m'))
	await I.see(text('10:00'))

	await I.click(durationBtn('5m'))
	await I.see(text('05:00'))
})
