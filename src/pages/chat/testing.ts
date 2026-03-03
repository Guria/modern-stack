import { backButton, button, createActor, heading, link, role } from '#shared/test'

export const chatLoc = {
	detailLoading: role('status', 'Loading conversation detail'),
	conversationNotFoundHeading: heading('Conversation not found'),
	messageThreadLoading: role('status', 'Loading message thread').wait(),
}

export const chatActor = createActor().extend((I) => ({
	seeError: async () => {
		await I.see(heading('Could not load conversations').wait())
		await I.see(role('alert'))
		await I.see(button('Try again'))
	},
	seeLoading: async () => {
		await I.see(role('status', 'Loading conversations page').wait())
		await I.dontSee(role('alert'))
	},
	goBack: async () => {
		await I.click(backButton('conversations'))
	},
	seeConversationList: async () => {
		await I.see(link(/Engineering/i))
		await I.see(link(/Alex Johnson/i))
	},
}))
