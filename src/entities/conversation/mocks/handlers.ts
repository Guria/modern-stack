import { assert } from '@reatom/core'
import { HttpResponse, delay, http } from 'msw'

import { conversationsMockData } from '#entities/conversation/mocks/data'
import { composeApiUrl } from '#shared/api'
import { Error404 } from '#shared/mocks'
import { neverResolve, to500 } from '#shared/mocks/utils'

import {
	CONVERSATIONS_API_PATH,
	CONVERSATIONS_UNREAD_COUNT_API_PATH,
} from '../api/conversationsApi'

const listUrl = composeApiUrl(CONVERSATIONS_API_PATH)
const unreadCountUrl = composeApiUrl(CONVERSATIONS_UNREAD_COUNT_API_PATH)
const detailUrl = composeApiUrl(`${CONVERSATIONS_API_PATH}/:conversationId`)

export const conversationList = {
	default: http.get(listUrl, async () => {
		await delay()

		return HttpResponse.json(conversationsMockData.map(({ messages: _, ...rest }) => rest))
	}),
	error: http.get(listUrl, () => to500()),
	loading: http.get(listUrl, neverResolve),
}

export const conversationUnreadCount = {
	default: http.get(unreadCountUrl, async () => {
		await delay()

		const unreadCount = conversationsMockData.reduce(
			(totalUnread, conversation) => totalUnread + conversation.unread,
			0,
		)

		return HttpResponse.json({ unreadCount })
	}),
}

export const conversationDetail = {
	default: http.get(detailUrl, async ({ params }) => {
		await delay()

		const conversationId = params['conversationId']
		const conversation = conversationsMockData.find(
			(conversation) => conversation.id === conversationId,
		)
		assert(conversation, `Conversation with id ${conversationId} not found in mock data`, Error404)

		return HttpResponse.json(conversation)
	}),
	error: http.get(detailUrl, () => to500()),
	loading: http.get(detailUrl, neverResolve),
}

export const conversationHandlers = [
	conversationList.default,
	conversationUnreadCount.default,
	conversationDetail.default,
]
