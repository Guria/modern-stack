import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	calculatorHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Calculator' }),
	acButtonAppears: (canvas) => canvas.findByRole('button', { name: 'AC' }),
	equalsButtonAppears: (canvas) => canvas.findByRole('button', { name: '=' }),
	zeroButtonAppears: (canvas) => canvas.findByRole('button', { name: '0' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeCalculatorContent: async () => {
		await I.see(loc.calculatorHeadingAppears)
		await I.see(loc.acButtonAppears)
		await I.see(loc.equalsButtonAppears)
		await I.see(loc.zeroButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'calculator' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders calculator heading', async () => {
	await I.see(loc.calculatorHeadingAppears)
})

Default.test('renders calculator buttons', async () => {
	await I.seeCalculatorContent()
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders calculator heading', async () => {
	await I.see(loc.calculatorHeadingAppears)
})

DefaultMobile.test('[mobile] renders calculator buttons', async () => {
	await I.seeCalculatorContent()
})
