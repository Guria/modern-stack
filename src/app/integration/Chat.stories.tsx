import preview from '#.storybook/preview'
import { App } from '#app/App'
import { conversationDetail, conversationList } from '#entities/conversation/mocks/handlers'
import { chatActor as I, chatLoc as loc } from '#pages/chat/testing'

const meta = preview.meta({
	title: 'Integration/Chat',
	component: App,
	parameters: { layout: 'fullscreen', initialPath: 'chat' },
	loaders: [(ctx) => void I.init(ctx)],
})

export default meta

export const Default = meta.story({ name: 'Default' })

Default.test('renders conversation list', async () => {
	await I.seeConversationList()
})

Default.test('shows no-selection message when no conversation selected', async () => {
	await I.see(loc.noSelectionMessageAppears)
})

Default.test('shows message thread when conversation is clicked', async () => {
	await I.clickItem('Engineering')

	const detail = await I.see(loc.detailRegionAppears)
	await I.seeText('Has anyone looked at the failing CI on main?', detail)
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
})

DefaultMobile.test('[mobile] renders conversation list', async () => {
	await I.seeConversationList()
})

DefaultMobile.test('[mobile] shows message thread when conversation is clicked', async () => {
	await I.clickItem('Engineering')

	const detail = await I.see(loc.detailRegionAppears)
	await I.seeText('Has anyone looked at the failing CI on main?', detail)
})

DefaultMobile.test('[mobile] can navigate back to conversation list', async () => {
	await I.clickItem('Engineering')
	await I.goBack()
	await I.seeConversationList()
})

export const HandlesChatLoadServerError = meta.story({
	name: 'Conversations Load Server Error',
	parameters: {
		msw: {
			handlers: { conversationList: conversationList.error },
		},
	},
})

HandlesChatLoadServerError.test('shows error state when conversations request fails', async () => {
	await I.seeError()
	await I.seeText("We couldn't load the conversations. Try again in a moment.")
})

export const HandlesChatLoadServerErrorMobile = meta.story({
	name: 'Conversations Load Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesChatLoadServerError.input.parameters,
})

HandlesChatLoadServerErrorMobile.test(
	'[mobile] shows error state when conversations request fails',
	async () => {
		await I.seeError()
		await I.seeText("We couldn't load the conversations. Try again in a moment.")
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

export const HandlesConversationDetailServerError = meta.story({
	name: 'Conversation Detail Server Error',
	parameters: {
		msw: {
			handlers: { conversationDetail: conversationDetail.error },
		},
	},
})

HandlesConversationDetailServerError.test(
	'shows not found when conversation detail request fails',
	async () => {
		await I.clickItem('Engineering')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.conversationNotFoundHeading.within(detail))
		await I.seeText(/No conversation exists for id/, detail)
	},
)

export const HandlesConversationDetailServerErrorMobile = meta.story({
	name: 'Conversation Detail Server Error (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: HandlesConversationDetailServerError.input.parameters,
})

HandlesConversationDetailServerErrorMobile.test(
	'[mobile] shows not found when conversation detail request fails',
	async () => {
		await I.clickItem('Engineering')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.conversationNotFoundHeading.within(detail))
		await I.seeText(/No conversation exists for id/, detail)
	},
)

export const KeepsLoadingWhenConversationDetailNeverResolves = meta.story({
	name: 'Conversation Detail Loading State',
	parameters: {
		msw: {
			handlers: { conversationDetail: conversationDetail.loading },
		},
	},
})

KeepsLoadingWhenConversationDetailNeverResolves.test(
	'shows message thread loading state while conversation detail is pending',
	async () => {
		await I.clickItem('Engineering')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.messageThreadLoading.within(detail))
		await I.dontSee(loc.maybeConversationNotFoundText.within(detail))
	},
)

export const KeepsLoadingWhenConversationDetailNeverResolvesMobile = meta.story({
	name: 'Conversation Detail Loading State (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	parameters: KeepsLoadingWhenConversationDetailNeverResolves.input.parameters,
})

KeepsLoadingWhenConversationDetailNeverResolvesMobile.test(
	'[mobile] shows message thread loading state while conversation detail is pending',
	async () => {
		await I.clickItem('Engineering')

		const detail = await I.see(loc.detailRegionAppears)
		await I.see(loc.messageThreadLoading.within(detail))
		await I.dontSee(loc.maybeConversationNotFoundText.within(detail))
	},
)
