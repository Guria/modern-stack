import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	usageHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Usage' }),
	storageResetNoteAppears: (canvas) =>
		canvas.findByText('Storage usage resets on the 1st of each month.'),
	breakdownHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Breakdown' }),
	documentsRowAppears: (canvas) => canvas.findByText('Documents'),
	mediaRowAppears: (canvas) => canvas.findByText('Media'),
	otherRowAppears: (canvas) => canvas.findByText('Other'),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeUsageContent: async () => {
		await I.see(loc.usageHeadingAppears)
		await I.see(loc.breakdownHeadingAppears)
		await I.see(loc.documentsRowAppears)
		await I.see(loc.mediaRowAppears)
		await I.see(loc.otherRowAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'usage' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders usage heading', async () => {
	await I.see(loc.usageHeadingAppears)
})

Default.test('renders storage reset note', async () => {
	await I.see(loc.storageResetNoteAppears)
})

Default.test('renders breakdown section', async () => {
	await I.see(loc.breakdownHeadingAppears)
	await I.see(loc.documentsRowAppears)
	await I.see(loc.mediaRowAppears)
	await I.see(loc.otherRowAppears)
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders usage heading', async () => {
	await I.see(loc.usageHeadingAppears)
})

DefaultMobile.test('[mobile] renders usage content', async () => {
	await I.seeUsageContent()
})
