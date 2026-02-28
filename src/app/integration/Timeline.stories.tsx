import preview from '#.storybook/preview'
import { App } from '#app/App'
import { timelineEventList } from '#entities/timeline-event/mocks/handlers'
import { timelineActor as I } from '#pages/timeline/testing'

const meta = preview.meta({
	title: 'Integration/Timeline',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'timeline' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders timeline events', async () => {
	await I.seeTimelineEvents()
})

Default.test('shows date groups', async () => {
	await I.seeDateGroups()
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders timeline events', async () => {
	await I.seeTimelineEvents()
})

DefaultMobile.test('[mobile] shows date groups', async () => {
	await I.seeDateGroups()
})

export const HandlesTimelineLoadServerError = meta.story({
	name: 'Timeline Load Server Error',
	parameters: {
		msw: {
			handlers: { timelineEventList: timelineEventList.error },
		},
	},
})

HandlesTimelineLoadServerError.test('shows error state when timeline request fails', async () => {
	await I.seeError()
	await I.seeText("We couldn't load the timeline data. Try again in a moment.")
})

export const HandlesTimelineLoadServerErrorMobile = meta.story({
	name: 'Timeline Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesTimelineLoadServerError.input.parameters,
})

HandlesTimelineLoadServerErrorMobile.test(
	'[mobile] shows error state when timeline request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the timeline data. Try again in a moment.")
	},
)

export const KeepsLoadingWhenTimelineRequestNeverResolves = meta.story({
	name: 'Timeline Request Loading State',
	parameters: {
		msw: {
			handlers: { timelineEventList: timelineEventList.loading },
		},
	},
})

KeepsLoadingWhenTimelineRequestNeverResolves.test(
	'keeps loading state for pending timeline request',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenTimelineRequestNeverResolvesMobile = meta.story({
	name: 'Timeline Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenTimelineRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenTimelineRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending timeline request',
	async () => {
		await I.seeLoading()
	},
)
