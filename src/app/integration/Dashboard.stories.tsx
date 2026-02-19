import { http, HttpResponse } from 'msw'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { DASHBOARD_API_PATH } from '#entities/dashboard'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const dashboardApiUrl = composeApiUrl(DASHBOARD_API_PATH)

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	dashboardHeadingAppears: (canvas) => canvas.findByRole('heading', { name: 'Dashboard' }),
	dashboardLoadingStateAppears: (canvas) =>
		canvas.findByRole('status', { name: 'Loading dashboard page' }),
	dashboardErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load dashboard' }),
	maybeDashboardErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load dashboard' }),
	dashboardAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeDashboardContent: async () => {
		await I.see(loc.dashboardHeadingAppears)
		await I.see((canvas) => canvas.findByText('Total Revenue'))
		await I.see((canvas) => canvas.findByText('Active Users'))
	},
	seeDashboardError: async () => {
		await I.see(loc.dashboardErrorHeadingAppears)
		await I.see(loc.dashboardAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'dashboard' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders dashboard heading', async () => {
	await I.see(loc.dashboardHeadingAppears)
})

Default.test('renders stat cards', async () => {
	await I.seeDashboardContent()
	await I.see((canvas) => canvas.findByText('Bounce Rate'))
	await I.see((canvas) => canvas.findByText('Avg. Session'))
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders dashboard heading', async () => {
	await I.see(loc.dashboardHeadingAppears)
})

DefaultMobile.test('[mobile] renders stat cards', async () => {
	await I.seeDashboardContent()
})

export const HandlesDashboardLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(dashboardApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesDashboardLoadServerError.test('shows error state when dashboard request fails', async () => {
	await I.seeDashboardError()
	await I.see((canvas) =>
		canvas.findByText("We couldn't load the dashboard data. Try again in a moment."),
	)
})

HandlesDashboardLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.dashboardAlertRegionAppears)
})

HandlesDashboardLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesDashboardLoadServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(dashboardApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesDashboardLoadServerErrorMobile.test(
	'[mobile] shows error state when dashboard request fails',
	async () => {
		await I.seeDashboardError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the dashboard data. Try again in a moment."),
		)
	},
)

HandlesDashboardLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.dashboardAlertRegionAppears)
})

HandlesDashboardLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenDashboardRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(dashboardApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenDashboardRequestNeverResolves.test(
	'keeps loading state for pending dashboard request',
	async () => {
		await I.see(loc.dashboardLoadingStateAppears)
		await I.dontSee(loc.maybeDashboardErrorHeading)
	},
)

export const KeepsLoadingWhenDashboardRequestNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(dashboardApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenDashboardRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending dashboard request',
	async () => {
		await I.see(loc.dashboardLoadingStateAppears)
		await I.dontSee(loc.maybeDashboardErrorHeading)
	},
)
