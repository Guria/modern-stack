import { http, HttpResponse } from 'msw'
import { expect, within } from 'storybook/test'

import preview from '#.storybook/preview'
import { App } from '#app/App'
import { handlersArray } from '#app/mocks/handlers'
import { CONVERSATIONS_API_PATH, CONVERSATIONS_UNREAD_COUNT_API_PATH } from '#entities/conversation'
import { conversationsMockData } from '#entities/conversation/mocks/data'
import { composeApiUrl } from '#shared/api'
import { neverResolve } from '#shared/mocks/utils'
import { createMyself, type Locator } from '#shared/test'

const conversationsApiUrl = composeApiUrl(CONVERSATIONS_API_PATH)
const conversationDetailApiUrl = composeApiUrl(`${CONVERSATIONS_API_PATH}/:conversationId`)
const conversationsUnreadCountApiUrl = composeApiUrl(CONVERSATIONS_UNREAD_COUNT_API_PATH)

const unreadCountHandler = http.get(conversationsUnreadCountApiUrl, () => {
	const unreadCount = conversationsMockData.reduce(
		(totalUnread, conversation) => totalUnread + conversation.unread,
		0,
	)
	return HttpResponse.json({ unreadCount })
})

const to500 = () => new HttpResponse(null, { status: 500 })

const loc = {
	noSelectionMessageAppears: (canvas) => canvas.findByText('Select a conversation'),
	chatLoadingStateAppears: (canvas) => canvas.findByRole('status', { name: 'Loading chat page' }),
	chatErrorHeadingAppears: (canvas) =>
		canvas.findByRole('heading', { name: 'Could not load conversations' }),
	maybeChatErrorHeading: (canvas) =>
		canvas.queryByRole('heading', { name: 'Could not load conversations' }),
	chatAlertRegionAppears: (canvas) => canvas.findByRole('alert'),
	retryButtonAppears: (canvas) => canvas.findByRole('button', { name: 'Try again' }),
	detailRegionAppears: (canvas) => canvas.findByRole('main'),
} satisfies Record<string, Locator>

const I = createMyself((I) => ({
	goBackToConversations: async () => {
		await I.click((canvas) => canvas.findByLabelText('Back to conversations'))
	},
	clickConversation: async (name: string | RegExp) => {
		const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name
		await I.click((canvas) => canvas.findByRole('link', { name: pattern }))
	},
	seeConversationList: async () => {
		await I.see((canvas) => canvas.findByRole('link', { name: /Engineering/i }))
		await I.see((canvas) => canvas.findByRole('link', { name: /Alex Johnson/i }))
	},
	seeChatError: async () => {
		await I.see(loc.chatErrorHeadingAppears)
		await I.see(loc.chatAlertRegionAppears)
		await I.see(loc.retryButtonAppears)
	},
}))

const meta = preview.meta({
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'chat' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({})

Default.test('renders conversation list', async () => {
	await I.seeConversationList()
})

Default.test('shows no-selection message when no conversation selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows message thread when conversation is clicked', async () => {
	await I.clickConversation('Engineering')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByText('Has anyone looked at the failing CI on main?')
})

export const DefaultMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders conversation list', async () => {
	await I.seeConversationList()
})

DefaultMobile.test('[mobile] shows message thread when conversation is clicked', async () => {
	await I.clickConversation('Engineering')

	const detail = await I.resolveLocator(loc.detailRegionAppears)
	const detailCanvas = within(detail)
	await detailCanvas.findByText('Has anyone looked at the failing CI on main?')
})

DefaultMobile.test('[mobile] can navigate back to conversation list', async () => {
	await I.clickConversation('Engineering')
	await I.goBackToConversations()
	await I.seeConversationList()
})

export const HandlesChatLoadServerError = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(conversationsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesChatLoadServerError.test('shows error state when conversations request fails', async () => {
	await I.seeChatError()
	await I.see((canvas) =>
		canvas.findByText("We couldn't load the conversations. Try again in a moment."),
	)
})

HandlesChatLoadServerError.test('renders as an alert region', async () => {
	await I.see(loc.chatAlertRegionAppears)
})

HandlesChatLoadServerError.test('shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const HandlesChatLoadServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(conversationsApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesChatLoadServerErrorMobile.test(
	'[mobile] shows error state when conversations request fails',
	async () => {
		await I.seeChatError()
		await I.see((canvas) =>
			canvas.findByText("We couldn't load the conversations. Try again in a moment."),
		)
	},
)

HandlesChatLoadServerErrorMobile.test('[mobile] renders as an alert region', async () => {
	await I.see(loc.chatAlertRegionAppears)
})

HandlesChatLoadServerErrorMobile.test('[mobile] shows retry button on error', async () => {
	await I.see(loc.retryButtonAppears)
})

export const KeepsLoadingWhenChatRequestNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [http.get(conversationsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenChatRequestNeverResolves.test(
	'keeps loading state for pending conversations request',
	async () => {
		await I.see(loc.chatLoadingStateAppears)
		await I.dontSee(loc.maybeChatErrorHeading)
	},
)

export const KeepsLoadingWhenChatRequestNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [http.get(conversationsApiUrl, neverResolve), ...handlersArray],
		},
	},
})

KeepsLoadingWhenChatRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending conversations request',
	async () => {
		await I.see(loc.chatLoadingStateAppears)
		await I.dontSee(loc.maybeChatErrorHeading)
	},
)

export const HandlesConversationDetailServerError = meta.story({
	parameters: {
		msw: {
			handlers: [unreadCountHandler, http.get(conversationDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConversationDetailServerError.test(
	'shows not found when conversation detail request fails',
	async () => {
		await I.clickConversation('Engineering')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Conversation not found' })
		await detailCanvas.findByText('No conversation exists for id "1".')
	},
)

export const HandlesConversationDetailServerErrorMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [unreadCountHandler, http.get(conversationDetailApiUrl, to500), ...handlersArray],
		},
	},
})

HandlesConversationDetailServerErrorMobile.test(
	'[mobile] shows not found when conversation detail request fails',
	async () => {
		await I.clickConversation('Engineering')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		await detailCanvas.findByRole('heading', { name: 'Conversation not found' })
		await detailCanvas.findByText('No conversation exists for id "1".')
	},
)

export const KeepsLoadingWhenConversationDetailNeverResolves = meta.story({
	parameters: {
		msw: {
			handlers: [
				unreadCountHandler,
				http.get(conversationDetailApiUrl, neverResolve),
				...handlersArray,
			],
		},
	},
})

KeepsLoadingWhenConversationDetailNeverResolves.test(
	'shows message thread loading state while conversation detail is pending',
	async () => {
		await I.clickConversation('Engineering')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading message thread',
		})
		expect(loadingState).toBeInTheDocument()
		expect(detailCanvas.queryByText('Conversation not found')).not.toBeInTheDocument()
	},
)

export const KeepsLoadingWhenConversationDetailNeverResolvesMobile = meta.story({
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: {
		msw: {
			handlers: [
				unreadCountHandler,
				http.get(conversationDetailApiUrl, neverResolve),
				...handlersArray,
			],
		},
	},
})

KeepsLoadingWhenConversationDetailNeverResolvesMobile.test(
	'[mobile] shows message thread loading state while conversation detail is pending',
	async () => {
		await I.clickConversation('Engineering')

		const detail = await I.resolveLocator(loc.detailRegionAppears)
		const detailCanvas = within(detail)
		const loadingState = await detailCanvas.findByRole('status', {
			name: 'Loading message thread',
		})
		expect(loadingState).toBeInTheDocument()
		expect(detailCanvas.queryByText('Conversation not found')).not.toBeInTheDocument()
	},
)
