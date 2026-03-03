import preview from '#.storybook/preview'
import { App } from '#app/App'
import { dashboardStats } from '#entities/dashboard/mocks/handlers'
import { dashboardActor as I, dashboardLoc as loc } from '#pages/dashboard/testing'
import { role, text } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Dashboard',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({
	name: 'Default',
	play: () => I.waitExit(role('status')),
})

Default.test('renders dashboard heading', async () => {
	await I.see(loc.heading)
})

Default.test('renders stat cards', async () => {
	await I.seeDashboardContent()
	await I.see(text('Bounce Rate'))
	await I.see(text('Avg. Session'))
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	play: () => I.waitExit(role('status')),
})

DefaultMobile.test('[mobile] renders dashboard heading', async () => {
	await I.see(loc.heading)
})

DefaultMobile.test('[mobile] renders stat cards', async () => {
	await I.seeDashboardContent()
})

export const HandlesDashboardLoadServerError = meta.story({
	name: 'Dashboard Load Server Error',
	play: () => I.waitExit(role('status')),
	parameters: {
		msw: {
			handlers: { dashboardStats: dashboardStats.error },
		},
	},
})

HandlesDashboardLoadServerError.test('shows error state when dashboard request fails', async () => {
	await I.seeError()
	await I.see(text("We couldn't load the dashboard data. Try again in a moment."))
})

export const HandlesDashboardLoadServerErrorMobile = meta.story({
	name: 'Dashboard Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesDashboardLoadServerError.input.parameters,
	play: () => I.waitExit(role('status')),
})

HandlesDashboardLoadServerErrorMobile.test(
	'[mobile] shows error state when dashboard request fails',
	async () => {
		await I.seeError()
		await I.see(text("We couldn't load the dashboard data. Try again in a moment."))
	},
)

export const KeepsLoadingWhenDashboardRequestNeverResolves = meta.story({
	name: 'Dashboard Request Loading State',
	parameters: {
		msw: {
			handlers: { dashboardStats: dashboardStats.loading },
		},
	},
})

KeepsLoadingWhenDashboardRequestNeverResolves.test(
	'keeps loading state for pending dashboard request',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenDashboardRequestNeverResolvesMobile = meta.story({
	name: 'Dashboard Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenDashboardRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenDashboardRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending dashboard request',
	async () => {
		await I.seeLoading()
	},
)
