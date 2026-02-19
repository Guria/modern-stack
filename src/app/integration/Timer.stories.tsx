import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	timerHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Timer' }),
	timerDisplayAppears: (canvas) => canvas.findByText('05:00'),
	startButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Start' }),
	resetButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Reset' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeTimerContent: async () => {
		await I.see(loc.timerHeadingAppears)
		await I.see(loc.timerDisplayAppears)
		await I.see(loc.startButtonAppears)
		await I.see(loc.resetButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'timer' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders timer heading', async () => {
	await I.see(loc.timerHeadingAppears)
})

Default.test('renders timer display', async () => {
	await I.see(loc.timerDisplayAppears)
})

Default.test('renders start and reset buttons', async () => {
	await I.see(loc.startButtonAppears)
	await I.see(loc.resetButtonAppears)
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders timer heading', async () => {
	await I.see(loc.timerHeadingAppears)
})

DefaultMobile.test('[mobile] renders timer display', async () => {
	await I.seeTimerContent()
})
