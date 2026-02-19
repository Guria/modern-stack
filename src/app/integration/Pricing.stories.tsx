import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	pricingHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Pricing' }),
	freePlanPriceAppears: (canvas) => canvas.findByText('$0/mo'),
	proPlanPriceAppears: (canvas) => canvas.findByText('$12/mo'),
	teamPlanPriceAppears: (canvas) => canvas.findByText('$29/mo'),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seePricingContent: async () => {
		await I.see(loc.pricingHeadingAppears)
		await I.see(loc.freePlanPriceAppears)
		await I.see(loc.proPlanPriceAppears)
		await I.see(loc.teamPlanPriceAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'pricing' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders pricing heading', async () => {
	await I.see(loc.pricingHeadingAppears)
})

Default.test('renders all plan cards', async () => {
	await I.seePricingContent()
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders pricing heading', async () => {
	await I.see(loc.pricingHeadingAppears)
})

DefaultMobile.test('[mobile] renders all plan cards', async () => {
	await I.seePricingContent()
})
