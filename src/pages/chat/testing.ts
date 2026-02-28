import { createActor, heading, link, loc } from '#shared/test'
import { dataPage, dataPageLoc } from '#widgets/data-page/testing'
import { masterDetail, masterDetailLoc } from '#widgets/master-details/testing'

const mdLoc = masterDetailLoc('conversation')

export const chatLoc = {
	...dataPageLoc('conversations'),
	...mdLoc,
	noSelectionMessageAppears: mdLoc.noSelectionMessageAppears,
	loadingStateAppears: loc((canvas) => canvas.findByRole('status', { name: 'Loading chat page' })),
	conversationNotFoundHeading: heading('Conversation not found'),
	messageThreadLoading: loc((canvas) =>
		canvas.findByRole('status', { name: 'Loading message thread' }),
	),
	maybeConversationNotFoundText: loc((canvas) => canvas.queryByText('Conversation not found')),
}

export const chatActor = createActor()
	.extend(dataPage(chatLoc))
	.extend(masterDetail('conversations'))
	.extend((I) => ({
		seeConversationList: async () => {
			await I.see(link(/Engineering/i))
			await I.see(link(/Alex Johnson/i))
		},
	}))
