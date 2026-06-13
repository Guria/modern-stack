import { assertNoRouteLoaderAbortErrors } from '#.storybook/abortErrorGuard'
import preview from '#.storybook/preview'
import { App } from '#app/App'
import { chatActor as I } from '#pages/chat/testing'
import { link, role, text } from '#shared/test'

const meta = preview.meta({
	title: 'Integration/Chat/List',
	component: App,
	parameters: {
		layout: 'fullscreen',
		initialPath: 'chat',
	},
	loaders: [(ctx) => I.init(ctx)],
})

export default meta

const assertExpectedDetailTeardown = async () => {
	await assertNoRouteLoaderAbortErrors('chatConversation')
}

export const Default = meta.story({
	name: 'Default',
	play: () => I.waitExit(role('status')),
})

Default.test('renders conversation list', async () => {
	await I.seeConversationList()
})

Default.test('shows no-selection message when no conversation selected', async () => {
	await I.see(text('No conversation selected'))
})

Default.test('shows message thread when conversation is clicked', async () => {
	await I.click(link(/Engineering/))
	await I.waitExit(role('status'))

	await I.scope(role('main'), async () => {
		await I.see(text('Has anyone looked at the failing CI on main?'))
	})
})

export const DefaultMobile = meta.story({
	name: 'Default (Mobile)',
	globals: { viewport: { value: 'sm', isRotated: false } },
	play: () => I.waitExit(role('status')),
})

DefaultMobile.test('[mobile] renders conversation list', async () => {
	await I.seeConversationList()
})

DefaultMobile.test('[mobile] shows message thread when conversation is clicked', async () => {
	await I.click(link(/Engineering/))
	await I.waitExit(role('status'))

	await I.scope(role('main'), async () => {
		await I.see(text('Has anyone looked at the failing CI on main?'))
	})
})

DefaultMobile.test('[mobile] can navigate back to conversation list', async () => {
	await I.click(link(/Engineering/))
	await I.waitExit(role('status'))
	await I.goBack()
	await I.see(link(/Engineering/))
	await assertExpectedDetailTeardown()
})
