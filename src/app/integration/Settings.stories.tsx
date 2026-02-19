import preview from '#.storybook/preview'
import { App } from '#app/App'
import { createMyself, type Locator } from '#shared/test'

const loc = {
	settingsHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Settings' }),
	profileSectionAppears: (canvas) => canvas.findByRole('heading', { name: 'Profile' }),
	notificationsSectionAppears: (canvas) => canvas.findByRole('heading', { name: 'Notifications' }),
	appearanceSectionAppears: (canvas) => canvas.findByRole('heading', { name: 'Appearance' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeSettingsContent: async () => {
		await I.see(loc.settingsHeadingAppears)
		await I.see(loc.profileSectionAppears)
		await I.see(loc.notificationsSectionAppears)
		await I.see(loc.appearanceSectionAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'settings' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders settings heading', async () => {
	await I.see(loc.settingsHeadingAppears)
})

Default.test('renders Profile section', async () => {
	await I.see(loc.profileSectionAppears)
})

Default.test('renders Notifications section', async () => {
	await I.see(loc.notificationsSectionAppears)
})

Default.test('renders Appearance section', async () => {
	await I.see(loc.appearanceSectionAppears)
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders settings heading', async () => {
	await I.see(loc.settingsHeadingAppears)
})

DefaultMobile.test('[mobile] renders all sections', async () => {
	await I.seeSettingsContent()
})
