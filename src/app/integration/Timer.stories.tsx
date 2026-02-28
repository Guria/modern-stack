import preview from '#.storybook/preview'
import { App } from '#app/App'
import { timerActor as I, timerLoc as loc } from '#pages/timer/testing'

const meta = preview.meta({
	title: 'Integration/Timer',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'timer' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders timer heading', async () => {
	await I.see(loc.headingAppears)
})

Default.test('renders timer display', async () => {
	await I.see(loc.displayAppears)
})

Default.test('renders start and reset buttons', async () => {
	await I.see(loc.startButtonAppears)
	await I.see(loc.resetButtonAppears)
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders timer heading', async () => {
	await I.see(loc.headingAppears)
})

DefaultMobile.test('[mobile] renders timer content', async () => {
	await I.seeTimerContent()
})
