import { reatomComponent } from '@reatom/react'
import { type ReactNode } from 'react'

import { MasterDetails } from '#widgets/master-details'

import { ConversationList, type ConversationListRow } from './conversations/ConversationList'

type Props = {
	conversations: ConversationListRow[]
	selectedConversationId: string | undefined
	detail: ReactNode
}

export const ChatPage = reatomComponent(
	({ conversations, selectedConversationId, detail }: Props) => {
		const hasDetail = selectedConversationId !== undefined

		return (
			<MasterDetails
				isDetailVisible={hasDetail}
				masterWidth="320px"
				master={
					<ConversationList conversations={conversations} selectedId={selectedConversationId} />
				}
				detail={detail}
			/>
		)
	},
	'ChatPage',
)
