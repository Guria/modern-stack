import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	storageProgressNoteAppears: (canvas) => canvas.findByText(/GB \/ \d+ GB/),
	upgradeToProBannerAppears: (canvas) => canvas.findByText('Unlimited storage & more'),
} satisfies Record<string, Locator>

const I = createMyself(() => ({}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('shows usage storage card in sidebar footer', async () => {
	await I.see(loc.storageProgressNoteAppears)
})

Default.test('shows upgrade to pro banner in sidebar footer', async () => {
	await I.see(loc.upgradeToProBannerAppears)
})

export const ActiveUsageRoute = meta.story({
	parameters: { initialPath: 'usage' },
})

ActiveUsageRoute.test(
	'shows storage card in sidebar and usage page content simultaneously',
	async () => {
		await I.see(loc.storageProgressNoteAppears)
		await I.see((canvas) => canvas.findByRole('heading', { name: 'Usage' }))
	},
)

ActiveUsageRoute.test('marks usage card as current page in sidebar', async () => {
	await I.see((canvas) => canvas.findByRole('link', { current: 'page' }))
})

export const ActivePricingRoute = meta.story({
	parameters: { initialPath: 'pricing' },
})

ActivePricingRoute.test(
	'shows upgrade banner in sidebar and pricing page content simultaneously',
	async () => {
		await I.see(loc.upgradeToProBannerAppears)
		await I.see((canvas) => canvas.findByRole('heading', { name: 'Pricing' }))
	},
)

ActivePricingRoute.test('marks pricing banner as current page in sidebar', async () => {
	await I.see((canvas) => canvas.findByRole('link', { current: 'page' }))
})
