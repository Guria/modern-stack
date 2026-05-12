import {
	createActor,
	heading,
	link,
	role,
	text,
	withDetailError,
	withPageError,
	withRetryAndLoading,
} from '#shared/test'

export const chatLoc = {
	conversationNotFoundHeading: heading('Conversation not found'),
	messageThreadLoading: role('status', 'Loading message thread'),
}

export const chatActor = createActor()
	.extend(withRetryAndLoading('Loading conversations page'))
	.extend(
		withPageError({
			title: 'Could not load conversations',
			description: "We couldn't load the conversations. Try again in a moment.",
		}),
	)
	.extend(
		withDetailError({
			title: 'Could not load conversation',
			description: "We couldn't load this conversation. Try again in a moment.",
		}),
	)
	.extend((I) => ({
		goBack: async () => {
			await I.click((canvas) => canvas.findByLabelText('Back to conversations'))
		},
		seeConversationNotFound: async (conversationId: string) => {
			await I.see(chatLoc.conversationNotFoundHeading)
			await I.see(text(`No conversation exists for id "${conversationId}".`))
		},
		seeConversationList: async () => {
			await I.scope(role('list', 'Chat'), async () => {
				await I.see(link(/Engineering/i))
				await I.see(link(/Alex Johnson/i))
			})
		},
	}))
