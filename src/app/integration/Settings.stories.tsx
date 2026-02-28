import preview from '#.storybook/preview'
import { App } from '#app/App'
import { settingsActor as I, settingsLoc as loc } from '#pages/settings/testing'

const meta = preview.meta({
	title: 'Integration/Settings',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'settings' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders settings heading', async () => {
	await I.see(loc.headingAppears)
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
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders settings heading', async () => {
	await I.see(loc.headingAppears)
})

DefaultMobile.test('[mobile] renders all sections', async () => {
	await I.seeSettingsContent()
})
