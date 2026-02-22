import { reatomComponent } from '@reatom/react'

import { BackButton, MobileHeaderTitle } from '#widgets/layout'

import { chatConversationRoute, chatRoute } from '../model/routes'
import { ConversationHeaderContent } from './ConversationHeaderContent'
import { ConversationHeaderContentLoading } from './ConversationHeaderContentLoading'

export const ChatConversationMobileHeader = reatomComponent(() => {
	if (!chatConversationRoute.match()) return null
	const conversation = chatConversationRoute.loader.data()
	const isLoadingConversation = chatConversationRoute.loader.pending() > 0
	return (
		<>
			<BackButton href={chatRoute.path()} label="Back to conversations" />
			{isLoadingConversation ? (
				<ConversationHeaderContentLoading />
			) : conversation ? (
				<ConversationHeaderContent conversation={conversation} />
			) : (
				<MobileHeaderTitle label="Conversation not found" />
			)}
		</>
	)
}, 'ChatConversationMobileHeader')
