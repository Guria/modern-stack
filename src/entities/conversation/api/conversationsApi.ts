import type { Conversation } from '#entities/conversation/model/types'
import { apiClient } from '#shared/api'

export const CONVERSATIONS_API_PATH = '/chat/conversations'
export const CONVERSATIONS_UNREAD_COUNT_API_PATH = '/chat/conversations/unread-count'

export async function fetchConversations() {
	return apiClient.get<Conversation[]>(CONVERSATIONS_API_PATH)
}

export async function fetchConversationById(conversationId: string) {
	return apiClient.get<Conversation>(`${CONVERSATIONS_API_PATH}/${conversationId}`)
}

export async function fetchConversationsUnreadCount() {
	const response = await apiClient.get<unknown>(CONVERSATIONS_UNREAD_COUNT_API_PATH)

	if (typeof response === 'number') {
		return response
	}

	if (Array.isArray(response)) {
		return response.reduce<number>((totalUnread, conversation) => {
			const unread =
				conversation &&
				typeof conversation === 'object' &&
				typeof (conversation as Record<string, unknown>)['unread'] === 'number'
					? ((conversation as Record<string, unknown>)['unread'] as number)
					: 0
			return totalUnread + unread
		}, 0)
	}

	if (response && typeof response === 'object') {
		const normalized = response as Record<string, unknown>
		if (typeof normalized['unreadCount'] === 'number') return normalized['unreadCount']
		if (typeof normalized['count'] === 'number') return normalized['count']
		if (typeof normalized['total'] === 'number') return normalized['total']
	}

	throw new Error('Unexpected unread count response shape')
}
