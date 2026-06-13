import preview from '#.storybook/preview'
import { App } from '#app/App'
import { conversationList } from '#entities/conversation/mocks/handlers'
import { chatActor as I } from '#pages/chat/testing'
import { role } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Chat/List Request',
	component: App,
	parameters: {
		layout: 'fullscreen',
		initialPath: 'chat',
	},
	loaders: [(ctx) => I.init(ctx)],
})

export default meta

export const HandlesChatLoadServerError = meta.story({
	name: 'Conversations Load Server Error',
	play: () => I.waitExit(role('status')),
	parameters: {
		msw: {
			handlers: { conversationList: conversationList.error },
		},
	},
})

HandlesChatLoadServerError.test('shows error state when conversations request fails', async () => {
	await I.seeError()
})

HandlesChatLoadServerError.test('keeps error state when retry also fails', async () => {
	await I.seeError()
	await I.retry()
	await I.waitExit(role('status'))
	await I.seeError()
})

export const RecoversAfterChatLoadRetry = meta.story({
	name: 'Conversations Load Retry Success',
	play: () => I.waitExit(role('status')),
	parameters: {
		msw: {
			handlers: { conversationList: conversationList.retrySucceeds() },
		},
	},
})

RecoversAfterChatLoadRetry.test('loads conversations after retry succeeds', async () => {
	await I.seeError()
	await I.retry()
	await I.waitExit(role('status'))
	await I.see(role('list', 'Chat').wait())
	await I.seeConversationList()
})

export const HandlesChatLoadServerErrorMobile = meta.story({
	name: 'Conversations Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesChatLoadServerError.input.parameters,
	play: () => I.waitExit(role('status')),
})

HandlesChatLoadServerErrorMobile.test(
	'[mobile] shows error state when conversations request fails',
	async () => {
		await I.seeError()
	},
)

export const KeepsLoadingWhenChatRequestNeverResolves = meta.story({
	name: 'Conversations Request Loading State',
	parameters: {
		msw: {
			handlers: { conversationList: conversationList.loading },
		},
	},
})

KeepsLoadingWhenChatRequestNeverResolves.test(
	'keeps loading state for pending conversations request',
	async () => {
		await I.seeLoading()
	},
)

export const KeepsLoadingWhenChatRequestNeverResolvesMobile = meta.story({
	name: 'Conversations Request Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenChatRequestNeverResolves.input.parameters,
})

KeepsLoadingWhenChatRequestNeverResolvesMobile.test(
	'[mobile] keeps loading state for pending conversations request',
	async () => {
		await I.seeLoading()
	},
)
