import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createActor, loc } from '#shared/test'

const storageProgressNoteAppears = loc((canvas) => canvas.findByText(/GB \/ \d+ GB/))
const upgradeToProBannerAppears = loc((canvas) => canvas.findByText('Unlimited storage & more'))

const I = createActor()

const meta = preview.meta({
	title: 'Integration/Sidebar Footer',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('shows usage storage card in sidebar footer', async () => {
	await I.see(storageProgressNoteAppears)
})

Default.test('shows upgrade to pro banner in sidebar footer', async () => {
	await I.see(upgradeToProBannerAppears)
})

export const ActiveUsageRoute = meta.story({
	name: 'Active Usage Route',
	parameters: { initialPath: 'usage' },
})

ActiveUsageRoute.test(
	'shows storage card in sidebar and usage page content simultaneously',
	async () => {
		await I.see(storageProgressNoteAppears)
		await I.see((canvas) => canvas.findByRole('heading', { name: 'Usage' }))
	},
)

ActiveUsageRoute.test('marks usage card as current page in sidebar', async () => {
	await I.see((canvas) => canvas.findByRole('link', { current: 'page' }))
})

export const ActivePricingRoute = meta.story({
	name: 'Active Pricing Route',
	parameters: { initialPath: 'pricing' },
})

ActivePricingRoute.test(
	'shows upgrade banner in sidebar and pricing page content simultaneously',
	async () => {
		await I.see(upgradeToProBannerAppears)
		await I.see((canvas) => canvas.findByRole('heading', { name: 'Pricing' }))
	},
)

ActivePricingRoute.test('marks pricing banner as current page in sidebar', async () => {
	await I.see((canvas) => canvas.findByRole('link', { current: 'page' }))
})
