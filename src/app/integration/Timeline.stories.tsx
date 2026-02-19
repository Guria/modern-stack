import { http, HttpResponse } from 'msw'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { TIMELINE_EVENTS_API_PATH } from '#entities/timeline-event'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const timelineApiUrl = composeApiUrl(TIMELINE_EVENTS_API_PATH)

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	timelineLoadingStateAppears: (canvas) =>
		canvas.findByRole('status', { name: 'Loading timeline page' }),
	timelineErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load timeline' }),
	maybeTimelineErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load timeline' }),
	timelineAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	seeTimelineEvents: async () => {
		await I.see((canvas) => canvas.findByText('Deployed v2.4.1 to production'))
		await I.see((canvas) => canvas.findByText('Merged PR #482 - Auth token refresh'))
	},
	seeDateGroups: async () => {
		await I.see((canvas) => canvas.findAllByText('Today').then((els: HTMLElement[]) => els[0]!))
		await I.see((canvas) => canvas.findAllByText('Yesterday').then((els: HTMLElement[]) => els[0]!))
	},
	seeTimelineError: async () => {
		await I.see(loc.timelineErrorHeadingAppears)
		await I.see(loc.timelineAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'timeline' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders timeline events', async () => {
	await I.seeTimelineEvents()
})

Default.test('shows date groups', async () => {
	await I.seeDateGroups()
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders timeline events', async () => {
	await I.seeTimelineEvents()
})

DefaultMobile.test('[mobile] shows date groups', async () => {
	await I.seeDateGroups()
})

export const HandlesTimelineLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(timelineApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesTimelineLoadServerError.test('shows error state when timeline request fails', async () => {
	await I.seeTimelineError()
	await I.see((canvas) =>
		canvas.findByText("We couldn't load the timeline data. Try again in a moment."),
	)
})

HandlesTimelineLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.timelineAlertRegionAppears)
})

HandlesTimelineLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesTimelineLoadServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(timelineApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesTimelineLoadServerErrorMobile.test(
	'[mobile] shows error state when timeline request fails',
	async () => {
		await I.seeTimelineError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the timeline data. Try again in a moment."),
		)
	},
)

HandlesTimelineLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.timelineAlertRegionAppears)
})

HandlesTimelineLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenTimelineRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(timelineApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenTimelineRequestNeverResolves.test(
	'keeps loading state for pending timeline request',
	async () => {
		await I.see(loc.timelineLoadingStateAppears)
		await I.dontSee(loc.maybeTimelineErrorHeading)
	},
)

export const KeepsLoadingWhenTimelineRequestNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(timelineApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenTimelineRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending timeline request',
	async () => {
		await I.see(loc.timelineLoadingStateAppears)
		await I.dontSee(loc.maybeTimelineErrorHeading)
	},
)
