import { retryComputed, wrap } from '@reatom/core'

import { fetchConversationById, fetchConversations } from '#entities/conversation'
import { m } from '#paraglide/messages.js'
import { rootRoute } from '#shared/router'
import { PageError } from '#widgets/data-page'

import { ChatPage } from '../ui/ChatPage'
import { ChatPageLoading } from '../ui/ChatPageLoading'
import { MessageThread } from '../ui/thread/MessageThread'
import { MessageThreadLoadingState } from '../ui/thread/MessageThreadLoadingState'
import { MessageThreadNoSelection } from '../ui/thread/MessageThreadNoSelection'
import { MessageThreadNotFound } from '../ui/thread/MessageThreadNotFound'

export const chatRoute = rootRoute.reatomRoute(
	{
		path: 'chat',
		loader: fetchConversations,
		render: (self) => {
			const selectedConversationId = chatConversationRoute()?.conversationId
			const { isFirstPending, isPending, data: conversations } = self.loader.status()
			if (isFirstPending || (isPending && !conversations)) {
				return <ChatPageLoading showDetail={selectedConversationId !== undefined} />
			}
			if (!conversations) {
				return (
					<PageError
						title={m.chat_error_title()}
						description={m.chat_error_description()}
						onRetry={wrap(() => retryComputed(self.loader))}
					/>
				)
			}

			return (
				<ChatPage
					conversations={conversations}
					selectedConversationId={selectedConversationId}
					getConversationHref={(conversationId: string) =>
						chatConversationRoute.path({ conversationId })
					}
					detail={self.outlet().at(0) ?? <MessageThreadNoSelection />}
				/>
			)
		},
	},
	'chat',
)

export const chatConversationRoute = chatRoute.reatomRoute(
	{
		path: ':conversationId',
		loader: ({ conversationId }) => fetchConversationById(conversationId),
		render: (self) => {
			const { isPending, data: conversation } = self.loader.status()
			if (isPending) return <MessageThreadLoadingState />
			return conversation ? (
				<MessageThread conversation={conversation} />
			) : (
				<MessageThreadNotFound conversationId={self().conversationId} />
			)
		},
	},
	'chatConversation',
)
