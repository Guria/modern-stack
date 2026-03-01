import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import type { Conversation } from '#entities/conversation'

import { MasterDetails } from '#widgets/master-details'

import { ConversationList } from './conversations/ConversationList'

type ChatPageProps = {
	conversations: Conversation[]
	selectedConversationId: string | undefined
	getConversationHref: (conversationId: string) => string
	detail: ReactNode
}

export const ChatPage = reatomComponent(
	({ conversations, selectedConversationId, getConversationHref, detail }: ChatPageProps) => {
		const hasDetail = selectedConversationId !== undefined

		return (
			<MasterDetails
				isDetailVisible={hasDetail}
				masterWidth="320px"
				master={
					<ConversationList
						conversations={conversations}
						selectedId={selectedConversationId}
						getConversationHref={getConversationHref}
					/>
				}
				detail={detail}
			/>
		)
	},
	'ChatPage',
)
